var fs = require('fs');
var cp = require('child_process');
var pt = require('path');


function read(filename) {
  const txt  =fs.readFileSync(filename, 'utf8')
  .replace(/\r/gm, '')
  .replace(/\n/gm, '«')
  .replace(/\/\*.*?\*\//gm,'')
  .replace(/«/gm, '\n')
  .replace(/\s+\/\/.*/g, '');
  return JSON.parse( txt);
}

const rush =read(`${__dirname}/../../rush.json`);
const pjs = {};

// load all the projects
for( const each of rush.projects ) {
  const packageName = each.packageName;
  const projectFolder = each.projectFolder;
  const project = require(`${__dirname}/../../${projectFolder}/package.json`);

  if( project.scripts.watch ) {
    console.log(`npm.cmd run watch {cwd: ${__dirname}/../../${projectFolder}}`);
    const proc = cp.spawn('npm.cmd', ['run','watch'],{cwd: `${__dirname}/../../${projectFolder}`,shell:true,stdio:"inherit"});
    const root = pt.resolve(`${__dirname}/../../${projectFolder}`);

    proc.on("error", (c,s) => {
      console.log(packageName);
      console.error( c.replace(/(\w*.*\.ts:)/g, `${root}/$1`));
      console.error( s.replace(/(\w*.*\.ts:)/g, `${root}/$1`));
    });
    proc.on('exit',(c,s)=> {
      console.log(packageName);
      console.error( c);
      console.error( s);
    });
    proc.on('message',(c,s)=> {
      console.log(packageName);
      console.error( c.replace(/(\w*.*\.ts:)/g, `${root}/$1`));
      console.error( s.replace(/(\w*.*\.ts:)/g, `${root}/$1`));
    })
  }
}

