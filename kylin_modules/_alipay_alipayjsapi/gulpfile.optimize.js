var Gulp = require('gulp');
var Gutil = require('gulp-util');
var Uglify = require('gulp-uglify');
var Concat = require('gulp-concat');
var Fs = require('fs-extra'); // https://github.com/jprichardson/node-fs-extra
var Path = require('path');
var Request = require('request');
var Babel = require("gulp-babel");
var Replace = require("gulp-replace");
var Rename = require("gulp-rename");
var RemoveLog = require("gulp-remove-logging");
var Optimize = require('gulp-optimize-js');
//var Webpack = require("gulp-webpack");
var Exec = require("sync-exec");
var Color = require('cli-color');
var error = Color.red.bold;
var warn = Color.yellow;
var notice = Color.blue;

// global variables
var rootPath = process.cwd();
var srcPath = Path.join(rootPath, './src');
var babelPath = Path.join(rootPath, './babel');
var docsPath = Path.join(rootPath, './docs');
var docsBackupPath = Path.join(rootPath, './_docs');
var distPath = Path.join(rootPath, './dist');
var tnpmLibPath = Path.join(rootPath, './lib');
var testPath = Path.join(rootPath, './test');
var vendorPath = Path.join(rootPath, './vendor');
var openDocsPath = Path.join(rootPath, '../open-nebula/docs/alipayjsapi');
var openDocsDistPath = Path.join(rootPath, '../open-nebula/dist/alipayjsapi');

var packageConfig = Fs.readJsonSync(Path.join(rootPath, './package.json'));

var verPlaceholder = '{%ALIPAYJSAPI_VERSION%}';
var jsPlaceholder = '{%ALIPAYJSAPI_JS_FILE%}';
var incMarkerPlaceholder = '{%ALIPAYJSAPI_INC%}';
var incMarkerContent = '<span style="padding:1px 3px;margin:1px 3px;border-radius:2px;background:#0ae;font-size:10px;color:#fff;">inc</span>';

var incPlaceHolder = /\/\*<<< inc >>>\*\/[\S\s]+?\/\*<<< endinc >>>\*\//gm;
var swPlaceHolder = /\/\*<<< sw >>>\*\/[\S\s]+?\/\*<<< endsw >>>\*\//;
var bizPlaceHolder = /\/\*<<< biz >>>\*\/[\S\s]+?\/\*<<< endbiz >>>\*\//;
var promisePlaceHolder = /\/\*<<< promise >>>\*\/[\S\s]+?\/\*<<< endpromise >>>\*\//;

var debugPlaceholder = '{%ALIPAYJSAPI_ENABLE_DEBUG%}';
var siteJSPath = 'https://a.alipayobjects.com/g/h5-lib/alipayjsapi/'+packageConfig.version+'/alipayjsapi.inc.min.js';
var myappJSPath = 'https://a.alipayobjects.com/g/h5-lib/alipayjsapi/'+packageConfig.version+'/alipayjsapi.min.js';
                  //https://a.alipayobjects.com/g/h5-lib/alipayjsapi/0.0.0/alipayjsapi.min.js
var localJSName = 'alipayjsapi.inc.js';
var debugSnippet = '<script>ap.enableDebug(true);</script>';
const env = process.env.NODE_ENV;
const isOnline = !!(env === 'online')
console.log('is online: ' + isOnline);
var timeoutId;
function copyDevJS(){
  if (env === 'dev') {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      Gulp.src(distPath + '/*.js')
        .pipe(Gulp.dest(openDocsDistPath));
    }, 1000)
  }
}

function swallowError (error) {
  // If you want details of the error in the console
  console.log(warn(error.toString()))

  this.emit('end')
}

// build js

// Gulp.task('worker:babel', function(){
//   return Gulp.src(srcPath + '/worker.js')
//     .on('error', swallowError)
//     .pipe(Babel({
//             presets:  [ [ "es2015", { modules: false } ] ]
//         }))
//     .pipe(Gulp.dest(babelPath))
// });
Gulp.task('src:babel:optimize', ['dist:remove'], function () {
  return (
    Gulp.src(srcPath + '/main.js')
    .on('error', swallowError)
    .pipe(Babel({
      plugins: [
        [
          Path.resolve(__dirname, "./scripts/optimize-plugin.js")
        ]
      ]
    }))
    .pipe(Rename('main_optimized.js'))
    .pipe(Gulp.dest(srcPath))
  )
});

Gulp.task('src:babel', ['src:babel:optimize'], function () {
  return Gulp.src(srcPath + '/*.js')
    .on('error', swallowError)
    .pipe(Replace(verPlaceholder, packageConfig.version))
    .pipe( isOnline ? RemoveLog({
      namespace: ['_sw_'],
      methods: ['log']
    }) : Gutil.noop())
    .pipe(Babel({
            presets:  [ [ "es2015", { modules: false } ] ]
        }))
    .pipe(Gulp.dest(babelPath))
});

Gulp.task('dist:output', ['src:babel'], () => {
  return Gulp.src(babelPath + '/main.js')
    .on('error', swallowError)
    .pipe(Rename('alipayjsapi.inc.js'))
    .pipe(Gulp.dest(distPath))
    .pipe(Gulp.dest(tnpmLibPath))

    .pipe(Replace(incPlaceHolder, ''))    //删除 inc 接口

    .pipe(Rename('alipayjsapi.js'))
    .pipe(Gulp.dest(distPath))
    .pipe(Gulp.dest(tnpmLibPath))
});

Gulp.task('dist:output:optimize', ['src:babel'], () => {
  return Gulp.src(babelPath + '/main_optimized.js')
    .on('error', swallowError)
    .pipe(Rename('alipayjsapi.optimize.inc.js'))
    .pipe(Gulp.dest(distPath))
    .pipe(Gulp.dest(tnpmLibPath))

    .pipe(Replace(incPlaceHolder, ''))    //删除 inc 接口

    .pipe(Rename('alipayjsapi.optimize.js'))
    .pipe(Gulp.dest(distPath))
    .pipe(Gulp.dest(tnpmLibPath))
});

Gulp.task('dist:sw', ['dist:output', 'dist:output:optimize'], function () {
  const sw = Fs.readFileSync(Path.join(babelPath, './worker.js'), 'utf8');
  const biz = Fs.readFileSync(Path.join(babelPath, './biz.js'), 'utf8');
  return Gulp.src(distPath + '/*.js')
    .on('error', swallowError)
    .pipe(Replace(swPlaceHolder, sw))
    .pipe(Replace(bizPlaceHolder, biz))
    .pipe(Rename({
      suffix: ".sw"
    }))
    .pipe(Gulp.dest(tnpmLibPath))
    //.pipe(Gulp.dest(distPath))
});

Gulp.task('dist:promise', ['dist:sw'], function () {
  const promise = Fs.readFileSync(Path.join(vendorPath, './es6-promise.auto.js'), 'utf8');
  return Gulp.src(distPath + '/*.js')
    .on('error', swallowError)
    .pipe(Replace(promisePlaceHolder, promise))
    .pipe(Gulp.dest(distPath))
});

Gulp.task('dist:others', ['dist:promise'], function () {
  return Gulp.src(tnpmLibPath + '/*.sw.js')
    .on('error', swallowError)
    .pipe(Gulp.dest(distPath))
});

Gulp.task('dist:min', ['dist:others'], function () {
  return Gulp.src(distPath + '/*.js')
    .on('error', swallowError)
    .pipe(Uglify())
    //.pipe(Optimize())
    .pipe(Rename({
      suffix: ".min"
    }))
    .pipe(Gulp.dest(distPath))
});

Gulp.task('dist:remove', function(){
  if (Fs.existsSync(distPath)) {
    Fs.removeSync(distPath);
  }
});

Gulp.task('src:build', ['dist:min'], function(){
  copyDevJS();
});

// pre process *.md
Gulp.task('doc:build', function () {

  var jsPathes = {
    dev: '/alipayjsapi/'+localJSName,
    myapp: myappJSPath,
    online: siteJSPath
  };
  var jsPath = jsPathes[env];
  var debugCodes = {
    dev: debugSnippet,
    online: ''
  };
  var debugCode = debugCodes[env];

  Gulp.src(docsPath + '/**/*')
    .pipe(Replace(verPlaceholder, packageConfig.version))
    .pipe(Replace(jsPlaceholder, jsPath))
    .pipe(Replace(incMarkerPlaceholder, incMarkerContent))
    .pipe(Replace(debugPlaceholder, debugCode))
    .pipe(Gulp.dest(openDocsPath))
    .pipe(Gulp.dest(docsBackupPath));
  copyDevJS()
});

Gulp.task('doc:remove', function() {
  if (Fs.existsSync(openDocsPath)) {
    Fs.removeSync(openDocsPath);
  }
});
Gulp.task('doc:publish', ['doc:remove', 'doc:build']);

Gulp.task('test:build', function () {
  var jsPathes = {
    dev: '../../dist/'+localJSName,
    myapp: myappJSPath,
    online: siteJSPath
  };
  var jsPathe = jsPathes[env];
  var debugCodes = {
    dev: debugSnippet,
    online: ''
  };
  var debugCode = debugCodes[env];

  Gulp.src(testPath + '/src/**/*')
    .pipe(Replace(verPlaceholder, packageConfig.version))
    .pipe(Replace(jsPlaceholder, jsPathe))
    .pipe(Replace(debugPlaceholder, debugCode))
    .pipe(Gulp.dest(testPath + '/dist'));
});
Gulp.task('tnpm:publish', function(){
  var cmd = `tnpm publish`;
  var result = Exec(cmd);
  result.stdout && console.log(result.stdout);
  result.stderr && console.error(result.stderr);
});
Gulp.task('tnpm:publish-beta', function(){
  var cmd = `tnpm publish --tag beta`;
  var result = Exec(cmd);
  result.stdout && console.log(result.stdout);
  result.stderr && console.error(result.stderr);
});

// deploy to open-nebula
Gulp.task('deploy', ['doc:remove', 'src:build', 'doc:build', 'test:build'], function(){
  // git
  var version = packageConfig.version;
  var getCurrentBranch = "git branch | grep \\* | cut -d ' ' -f2"
  var checkBranch = Exec(getCurrentBranch);
  if (checkBranch.stdout) {
    var branch = checkBranch.stdout.replace('\n', '');
    if (branch !== 'master') {
      console.error(error(`注意：当前在 ${branch} 分支，请切换到 master 分支合并后再发布！`));
      return;
    }
  }
  var cmd = `git add .` +
            ` && git commit -am "online ${version}"` +
            ` && git push origin` +
            ` && git tag ${version}` +
            ` && git push origin ${version}` +
            ` && tnpm publish` +
            ` && qtdeploy all`;
  var result = Exec(cmd);
  result.stdout && console.log(result.stdout);
  result.stderr && console.error(result.stderr);
});

// watch files
Gulp.task('src:watch', ['src:build'], function() {
  Gulp.watch([srcPath + '/*.js'], ['src:build']);
});
Gulp.task('doc:watch', ['doc:build'], function() {
  Gulp.watch([docsPath + '/**/*'], ['doc:build']);
});
Gulp.task('test:watch', ['test:build'], function() {
  Gulp.watch([testPath + '/src/**/*'], ['test:build']);
});
Gulp.task('watch', ['src:watch', 'doc:watch', 'test:watch']);



// default task
Gulp.task('default', ['src:build', 'doc:build', 'test:build']);
