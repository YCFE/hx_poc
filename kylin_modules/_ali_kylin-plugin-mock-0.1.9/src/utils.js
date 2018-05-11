
import fs from 'fs';
import chalk from 'chalk';
import glob from 'glob';
import path from 'path';

const cwd = process.cwd();

export function getLangConfigStatus({
  cwd,
  configDir,
  absoluteConfigDir
}) {

  const langConfigDir = absoluteConfigDir;

  const ret = {
    dir: {},
    files: {},
  };

  try {
    const fileStat = fs.statSync(langConfigDir);
    if ( fileStat.isDirectory() ) {
      ret.dir = {
        success: true,
        msg: `[${ configDir }] 目录存在`
      };
      // 尝试读取文件列表
      const fileList = glob.sync(path.resolve(langConfigDir, '*.js'));
      if ( fileList.length > 0 ) {
        ret.files = {
          success: true,
          msg: `[${ configDir }] 包含语言文件[ ${ chalk.yellow( fileList.map(p => path.relative(langConfigDir, p)).join(', ') ) }]`
        }
      } else {
        ret.files = {
          success: false,
          msg: `[${ chalk.red(configDir) }] 目录不包含${ chalk.red('*.js') }文件`
        }
      }
    } else {
      ret.dir = {
        success: false,
        msg: `[${ chalk.red(configDir) }] 不是目录`
      }
    }
  }
  catch(ex) {
    console.error(ex)
    ret.dir = {
      success: false,
      msg: `[${ chalk.red(configDir) }] 目录不存在`
    }
  }

  return ret;
}