

const fs = require('fs'); // For reading a file
const MarkdownIt = require('markdown-it'), // Turns Markdown into HTML
  md = new MarkdownIt();
const commandLineArgs = require('command-line-args'); // Command line flags

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'dest', alias: 'd', type: String },
  { name: 'init', type: Boolean },
  { name: 'mdHelp', type: Boolean }
];

var i = 0;
const options = commandLineArgs(optionDefinitions);
if (options.help) {
  var send = '\tHelp:\n';
  send += '\t--help, -h: Display this message\n';
  send += '\t--file, -f: Specify markdown file to read from\n';
  send += '\t--dest, -d: Specify where you want files to be made';
  send += '\t--init: make a new markdown file with starters\n';
  send += '\t--mdHelp: Get help for markdown parseing commands (coming soon)\n';
  console.log(send);
  process.exit();
}


if (typeof options.file == 'undefined') {
  var file = 'index.md';
} else {
  var file = options.file;
}
if (typeof options.dest == 'undefined') {
  var dest = '';
} else {
  var dest = options.dest;
}
if (options.init) {
  fs.stat(file, function (err, stats) {
    if (err) {
      return console.log(err);
    }
    if (stats.isFile()) {
      console.log('index.md is already a file.');
      process.exit();
    }
  });
  var starter = '/+ start index\n\n/+ end index';
  fs.writeFile('index.md', starter, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
  process.exit();
}

fs.readFile(file, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var dataArray = data.split('\n'); // Split at each new line
  var cmdArray = [];
  for (i = 0; i < dataArray.length; i++) {
    var string = dataArray[i],
      substring = "/+";
    if (string.includes(substring)) { // Searches for the command starter
      string = string.substring(2, string.length - 1); // Makes it only the command
      command = string.split(' ');
      cmdArray.push({cmd: command, line: i});
    }
  }

  var page = '',
    start, end = 0,
    blockArray = [];
  for (i = 0; i < cmdArray.length; i++) {
    var cmd = cmdArray[i].cmd,
      line = cmdArray[i].line;
    if (cmd[0] == 'start') {
      if (cmd[1] == undefined) {
        console.log('Traceback: '+ (line + 1) + ': /+ ' + cmd + '\nParsing error\nNo page specified'); // Error for if no page name
        process.exit();
      } else {
        page = cmd[1];
        start = line + 1; // Start 1 line after start command
      }
    }
    else if (cmd[0] == 'end'){
      if (cmd[1] == undefined) {
        console.log('Traceback: '+ (line + 1) + ': /+ ' + cmd + '\nParsing error\nNo page specified'); // Error for if no page name
        process.exit();
      }
      else if (cmd[1] != page) {
        console.log('Traceback: '+ (line + 1) + ': /+ ' + cmd + '\nParsing error\n' + cmd[1] +  ' was never started or another page was started between them'); // Error for if page block wasn't started
        process.exit();
      } else {
        end = line - 1; // End 1 line before end command
        blockArray.push({page: page, start: start, end: end});

      }
    } else {
      console.log('Traceback: '+ (line + 1) + ': /+ ' + cmd + '\nParsing error\nNot a valid command'); // Error for if no command
      process.exit();
    }
  }
  var pageArray = [];
  for (i = 0; i < blockArray.length; i++) {
    var text = '';
    for (var p = blockArray[i].start; p <= blockArray[i].end; p++) {
      text += dataArray[p] + '\n';
    }
    pageArray.push({page: blockArray[i].page + '.html', data: text});
  }
  for (i = 0; i < pageArray.length; i++) {
    page = pageArray[i];
    var result = md.render(page.data);
    fs.writeFile(dest + page.page, result, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log('Made ' + page.page);
  }
});
