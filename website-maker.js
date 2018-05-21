/* jshint esversion: 6 */


const fs = require('fs'); // For reading a file
const MarkdownIt = require('markdown-it'), // Turns Markdown into HTML
  md = new MarkdownIt();
const commandLineArgs = require('command-line-args'); // Command line flags

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'dest', alias: 'd', type: String },
  { name: 'tag', alias: 't', type: String },
  { name: 'init', type: Boolean },
  { name: 'mdhelp', alias: 'm', type: Boolean }
];

var i, p = 0;
const options = commandLineArgs(optionDefinitions);
if (options.help) {
  var send = '\tHelp:\n';
  send += '\t--help, -h: Display this message\n';
  send += '\t--file, -f: Specify markdown file to read from (default: index.md in current directory)\n';
  send += '\t--dest, -d: Specify where you want files to be made (default: current directory)\n';
  send += '\t--tag, -t: Specify command tags (default: /!)\n';
  send += '\t--init: make a new markdown file with starters\n';
  send += '\t--mdhelp: Get help for markdown parsing commands\n';
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
if (typeof options.tag == 'undefined') {
  var tag = '/!';
} else {
  var tag = options.tag;
}

if (options.init) {
  fs.stat(file, function (err, stats) {
    if (err) {
      return console.log(err);
    }
    if (stats.isFile()) {
      return console.log('index.md is already a file.');
    }
  });
  var starter = '/!start index\n\n/!end index';
  fs.writeFile('index.md', starter, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
  process.exit();
}
if (options.mdhelp) {
  send = 'All commands are started with /! in the format /!<command>. Don\'t include the angle brackets when using commands\n';
  send += '\tstart page <page>: Start new page\n';
  send += '\tend page <page>: End page';
  console.log(send);
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
      starter = tag;
    if (string.includes(starter)) { // Searches for the command starter
      string = string.substring(tag.length, string.length - 1); // Makes it only the command
      command = string.split(' ');
      cmdArray.push({cmd: command, line: i});
    }
  }
  var page = '',
    start, end, line = 0,
    blockArray = [];
  for (i = 0; i < cmdArray.length; i++) {
    var cmd = cmdArray[i].cmd;
    line = cmdArray[i].line;
    // /!start
    if (cmd[0] == 'start') {
      if (cmd[1] == undefined) {
        return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\nNo start specified'); // Error for if no page name
      }
      // /!start page
      else if (cmd[1] == 'page') {
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\nNo page specified'); // Error for if no page name
        } else {
          page = cmd[2];
          start = line + 1; // Start 1 line after start command
        }
      }
    }
    // /!end
    else if (cmd[0] == 'end'){
      if (cmd[1] == undefined) {
        return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\nNo end specified'); // Error for if no page name
      }
      // /!end page
      else if (cmd[1] == 'page') {
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\nNo page specified'); // Error for if no page name
        }
        else if (cmd[2] != page) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\n' + cmd[1] +  ' was never started or another page was started between them'); // Error for if page block wasn't started
        } else {
          end = line - 1; // End 1 line before end command
          blockArray.push({page: page, start: start, end: end});
        }
      }
    } else {
      return console.log('Traceback: '+ (line + 1) + ': ' + tag + cmd + '\nParsing error\nNot a valid command'); // Error for if no command
    }
  }
  var pageArray = [];
  // Puts everything that goes to a page into one string and makes a new array with the page name and that string
  for (i = 0; i < blockArray.length; i++) {
    var text = '';
    for (p = blockArray[i].start; p <= blockArray[i].end; p++) { // From start of page to end of page
      text += dataArray[p] + '\n';
    }
    pageArray.push({page: blockArray[i].page + '.html', data: text});
  }

  for (i = 0; i < pageArray.length; i++) {
    page = pageArray[i];
    var resultArray = [];
    var tabLength = 0;
    var result = '';
    resultArray = md.render(page.data).split('\n'); // Renders Markdown into HTML and splits it
    // Finds start and end tags and inserts tabs based on the number it is at
    for (p = 0; p < resultArray.length; p++) {
      var tab = '';
      line = resultArray[p];
      var startTag = /<[^\/].+>/; // everything inside angle brakets not including a '/' (start tags)
      var endTag = /<\/.+>/; // everything inside angle brakets including '/' (end tags)
      if (endTag.test(line) && !startTag.test(line)){ // If line has end tag. Effects current line
        tabLength -= 1;
      }
      for (j = 0; j < tabLength; j++) { // Makes tabs based on tabLength number
        tab += '\t';
      }
      if (startTag.test(line) && !endTag.test(line)) { // If line has start tag. Effects next line
        tabLength += 1;
      }
      result += tab + line + '\n'; // Makes it a part of result variable
    }
    // writes result to page
    fs.writeFile(dest + page.page, result, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log('Made ' + page.page);
  }
});
