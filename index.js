const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"';
const siteconfig = JSON.parse(fs.readFileSync('./siteconfig.json', 'utf8'));
const projectName = siteconfig.projectName;
const basePath = siteconfig.basePath;
const paths = siteconfig.pagelist;


/* =============================================================================
   make projectName dir
============================================================================= */
if (!fs.existsSync('capture/' + projectName)) {
  fs.mkdir('capture/' + projectName);
}

/* =============================================================================
   run capture
============================================================================= */
for (var i = 0; i < paths.length; i++) {
    childProcess.exec(chrome + ' --headless --disable-gpu --screenshot=.\/capture\/' + projectName + '/' + paths[i]['name'] + '.png --window-size=1280,4000 ' + basePath + paths[i]['path']);
}
