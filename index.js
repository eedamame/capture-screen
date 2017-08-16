const childProcess = require('child_process');
const fs = require('fs');

const chrome = '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"';
const pagelist = JSON.parse(fs.readFileSync('./siteconfig.json', 'utf8'));
const basePath = pagelist.basePath;
const paths = pagelist.pagelist;

//const paths = require('./pagelist.json');
//const paths = [
//  { 'name': '01_toppage', path: '' },
//  { 'name': '02_admissions', path: 'admissions/index.php' }
//];
for (var i = 0; i < paths.length; i++) {
    childProcess.exec(chrome + ' --headless --disable-gpu --screenshot=.\/capture\/' + paths[i]['name'] + '.png --window-size=1280,4000 ' + basePath + paths[i]['path']);
}
