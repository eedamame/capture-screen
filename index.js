const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const chrome = '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"';
const siteconfig = JSON.parse(fs.readFileSync('./siteconfig.json', 'utf8'));
const projectName = siteconfig.projectName;
const basePath = siteconfig.basePath;
const paths = siteconfig.pagelist;

const today = moment(Date.now()).format('YYMMDD');

const projectDir = 'capture/' + projectName;
const todaysDir = projectDir + '/' + today;

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
  childProcess.exec(
    chrome + ' --headless --disable-gpu --window-size=1280,4000 --screenshot=.\/' + todaysDir + '/'
      + paths[i]['name'] + '.png ' + basePath + paths[i]['path']
  );
}
