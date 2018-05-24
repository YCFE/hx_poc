const fs = require('fs');
const path = require('path');
const readline = require('readline');
const program = require('commander');
const copyFile = require('copy-template-dir');

program.option('-p, --path <string>', 'input path').parse(process.argv);

const paths = program.path;

const srcPath = path.join(process.cwd(), 'template');

const dstPath = path.join(process.cwd(), `src/pages/${paths}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('input title: ', (answer) => {
  copyFile(srcPath, dstPath, {
    title: answer
  }, (r) => {
    if(!r) {
      console.log('create success!');
    }
  });
  rl.close();
});
