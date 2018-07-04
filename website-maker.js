/* jshint esversion: 6 */
/*
 * Markdown Website builder - v0.6
 * Created by: Trevor W.
 * Github: https://github.com/trevor34/markdown-website-builder/
*/

const fs = require('fs'); // For reading a file
const MarkdownIt = require('markdown-it'), // Turns Markdown into HTML
  md = new MarkdownIt();
const commandLineArgs = require('command-line-args'); // Command line flags

const optionDefinitions = [ // Command Line Flags
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'dest', alias: 'd', type: String },
  { name: 'tag', alias: 't', type: String },
  { name: 'init', type: Boolean },
  { name: 'mdhelp', alias: 'm', type: Boolean }
];

var i, p = 0;
const options = commandLineArgs(optionDefinitions);
if (options.help) { // --help, -h
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

if (typeof options.file == 'undefined') { // --file, -f
  var file = 'index.md';
} else {
  var file = options.file;
}
if (typeof options.dest == 'undefined') { // --dest, -d
  var dest = '';
} else {
  var dest = options.dest;
}
if (typeof options.tag == 'undefined') { // --tag, -t
  var tag = '/!';
} else {
  var tag = options.tag;
}

if (options.init) { // --init
  fs.stat(file, function (err, stats) {
    // Finds File named after the file tag. If it exists, don't do anything and exit, else, make file
    if (err) {
      return console.log(err);
    }
    if (stats.isFile()) {
      console.log('index.md is already a file.');
      process.exit();
    }
  });
  var starter = '/!start index\n\n/!end index';
  fs.writeFile(file, starter, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
  process.exit();
}
if (options.mdhelp) { // --mdhelp, -m
  send = '\tAll commands are started with /! in the format /!<command>. Don\'t include the angle brackets when using commands\n';
  send += '\t  start page <page>: Start new page\n';
  send += '\t  end page <page>: End page';
  console.log(send);
  process.exit();
}

var index = false;
fs.readFile(file, 'utf8', function (err, data) { // Main program
  if (err) {
    return console.log(err);
  }
  var dataArray = data.split('\n'); // Split at each new line
  var cmdArray = [];

  for (i = 0; i < dataArray.length; i++) {
    // Finds all parsing commands and puts them in an array
    var string = dataArray[i],
      starter = tag;
    if (string.includes(starter)) { // Searches for the command starter
      string = string.substring(tag.length, string.length); // Makes it only the command
      command = string.split(' ');
      cmdArray.push({cmd: command, line: i});
    }
  }

  var page = '', // Declaring variables
    start, end, line = 0,
    blockArray = [];
  for (i = 0; i < cmdArray.length; i++) {
    // Does stuff based on commands
    var cmd = cmdArray[i].cmd;
    line = cmdArray[i].line;
    // /!(start/end) div
    if (cmd[1] == 'div') {
      command = '';
      for (var e = 0; e < cmd.length; e++) {
        command += cmd[e] + ' '; // makes command into a string
      }
      dataArray[line] = "\n/!" + command + '\n'; // Splits command away from other parts so it doesn't get parsed into another line
    }
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
  if (cmdArray < 1) { // If no parsing commands are in the file
    blockArray.push({page: 'index', start: 0, end: dataArray.length - 1});
    console.log('There are no parsing commands. Parsing into index.html');
  }
  var pageArray = [];
  // Puts everything that goes to a page into one string and makes a new array with the page name and that string
  for (i = 0; i < blockArray.length; i++) {
    var text = '';
    for (p = blockArray[i].start; p <= blockArray[i].end; p++) { // From start of page to end of page
      text += dataArray[p] + '\n';
    }
    pageArray.push({page: dest + blockArray[i].page + '.html', data: text});
  }

  for (i = 0; i < pageArray.length; i++) { // Makes all of the pages
    page = pageArray[i];
    var resultArray, divArray = [];
    var tabLength = 0;
    var result = '';
    resultArray = md.render(page.data).split('\n'); // Renders Markdown into HTML and splits it


    for (p = 0; p < resultArray.length; p++) {
      line = resultArray[p];
      var starting = '<p>/!';
      if (line.includes(starting)) { // Finds all of the post-parsing commands
        aftCommand = line.substring(5, line.length - 4).split(' '); // Removes 'p' tags and splits it into commands

        if (aftCommand[1] == 'div') {
          // /!start div ___
          if (aftCommand[0] == 'start') {

            if (aftCommand[2] == undefined) {
              line = '<div>';
            }
            // /!start div #id
            else if (aftCommand[2].substring(0, 1) == '#') {
              line = '<div id="' + aftCommand[2].substring(1) + '">';
            }
            // /!start div .class or /!start div class
            else {
              line = '<div class="' + aftCommand[2].substring(1) + '">';
            }
          }
          else if (aftCommand[0] == 'end') {
            line = '</div>';
          }
        }
      }

      // Finds start and end tags and inserts tabs based on the number it is at
      var tab = '';
      var startTag = /<[^\/].+>/; // everything inside angle brakets not including a '/' (start tags)
      var endTag = /<\/.+>/; // everything inside angle brakets including '/' (end tags)

      if (endTag.test(line) && !startTag.test(line)){ // If line has end tag and not start tag. Effects current line
        tabLength -= 1;
      }
      for (j = 0; j < tabLength; j++) { // Makes tabs based on tabLength number
        tab += '\t';
      }
      if (startTag.test(line) && !endTag.test(line)) { // If line has start tag and not end tag. Effects next line
        tabLength += 1;
      }
      result += tab + line + '\n'; // Makes it a part of result variable
    }
    // writes result to file
    fs.writeFile(page.page, result, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
    console.log('Made ' + page.page);
  }
});
