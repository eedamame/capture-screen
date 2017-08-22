// modules
const util = require('util');
const childProcess = require('child_process');
const fs = require('fs');
const moment = require('moment');

const exec = util.promisify(childProcess.exec);

// config
//const chrome = '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"';
const chrome = '"/Applications/Chromium.app/Contents/MacOS/Chromium"';
//const chrome = '"/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"';


/* =============================================================================
 * options
 * -------
 * project: (alias: p) project name that uses config file name (siteconfig_PROJECTNAME.json)
 * compare: (alias: c) target directory compare screenshots 
 *
============================================================================= */

const minimist = require('minimist');
let argv = minimist(process.argv.slice(2), {
  string: ['project', 'diff'],
  boolean: [],
  alias: {
    p: 'project',
    c: 'compare'
  }
})


let configFile = './siteconfig.json';
if(argv.project) {
  configFile = './siteconfig_' + argv.project + '.json';
}
if(!fs.existsSync(configFile)) {
  console.log(configFile + ' does not exist.');
  return;
}
const siteconfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));

// variables
const projectName = siteconfig.projectName;
const basePath = siteconfig.basePath;
const paths = siteconfig.pagelist;
const today = moment(Date.now()).format('YYMMDD');
const projectDir = 'capture/' + projectName;
const todaysDir = projectDir + '/' + today;
const hcOptions = [
  '--headless',
  '--disable-gpu',
  '--allow-insecure-localhost',
  '--allow-running-insecure-content',
  '--disable-web-security',
  '--ignore-certificate-errors',
  '--window-size=1280,4000'
];// ooptions for headless chrome

/* =============================================================================
   make projectName dir
============================================================================= */
/* ----------------------------------------------
   make project dir
---------------------------------------------- */
const makeProjectDir = () => fs.mkdir(projectDir, function() {
  console.log('made project dir: `' + projectDir + '`');
});

/* ----------------------------------------------
   make todays dir
---------------------------------------------- */
const makeTodaysDir = () => fs.mkdir(todaysDir, function() {
  console.log('made todays dir: `' + todaysDir + '`');
});

/* ----------------------------------------------
   check dir
---------------------------------------------- */
if (!fs.existsSync(projectDir)) {
  makeProjectDir();
  if (!fs.existsSync(todaysDir)) {
    makeTodaysDir();
  }
} else {
  if (!fs.existsSync(todaysDir)) {
    makeTodaysDir();
  }
}

/* =============================================================================
   run capture
============================================================================= */
for (var i = 0; i < paths.length; i++) {
  const targetName = paths[i]['name'];
  const targetURL = basePath + paths[i]['path'];
  const todaysCapture = todaysDir + '/' + targetName + '.png';
  const diffImg = todaysDir + '/' + targetName + '_diff.png';
  let beforeImg;
  if(argv.compare) {
    beforeImg = projectDir + '/' + argv.compare + '/' + targetName + '.png';
  }

  async function capture() {
    try {
      if(argv.compare) {
        await exec(chrome + ' ' + hcOptions.join(' ') + ' --screenshot=.\/' + todaysCapture + ' ' + targetURL);
        await exec('composite -compose difference ' + beforeImg + ' ' + todaysCapture + ' ' + diffImg);
        const { error, stdout, stderr } = await exec('identify -format "%[mean]" ' + diffImg);
          if(stdout > 0) {
            console.log('Changed: ' + targetName);
          }
          else {// if there is no difference remove diff file
            await exec('rm ' + diffImg);
          }
          if (error !== null && error !== undefined) {
            console.log('exec error: ' + error);
          }
      } else { // only screenshot without campare option
        await exec(chrome + ' ' + hcOptions.join(' ') + ' --screenshot=.\/' + todaysCapture + ' ' + targetURL);
      }
    } catch(err) {
      throw err;
    }
  }
  capture();
}
