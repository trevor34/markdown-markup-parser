#!/usr/bin/env node

/* jshint esversion: 6 */
/*
 * Markdown Markup Parser - v1.0.2
 * Created by: Trevor W.
 * Github: https://github.com/trevor34/markdown-markup-parser/
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
  { name: 'mdhelp', alias: 'm', type: Boolean },
  { name: 'version', alias: 'v', type: Boolean }
];

var i, p, e = 0;
const options = commandLineArgs(optionDefinitions);

// Command Line Flags
// Help commands

// --version, -v
if (options.version) {
  console.log('v1.0.2');
  process.exit();
}

if (options.help) { // --help, -h
  console.log(`
  Help:
    --help, -h: Display this message
    --file, -f: Specify markdown file to read from (default: index.md in current directory)
    --dest, -d: Specify where you want files to be made (default: current directory)
    --tag, -t: Specify command tags (default: /!)
    --init: make a new markdown file with starters
    --mdhelp, -m: Get help for markdown parsing commands
    --version, -v: View version number
  `);
  process.exit();
}

// --mdhelp, -m
if (options.mdhelp) {
  console.log(`
  All commands are started with /! in the format /!<command>. Don't include the angle brackets when using commands
  Page Syntax:
    start page <page>: Start new page
    end page <page>: End page
  Div tag syntax:
    start div <optional: name>: Starts div
    end div <optional: name>: Ends div
  Selectors:
    /!selector <selectors> <text>

For more info, check out https://github.com/trevor34/markdown-markup-parser/blob/master/syntax.md
  `);
  process.exit();
}

// --init
if (options.init) {
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

// Program commands
// --file, -f
if (typeof options.file == 'undefined') {
  var file = 'index.md';
} else {
  var file = options.file;
}

// --dest, -d
if (typeof options.dest == 'undefined') {
  var dest = '';
} else {
  var dest = options.dest;
}

// --tag, -t
if (typeof options.tag == 'undefined') {
  var tag = '/!';
} else {
  var tag = options.tag;
}


// Main program
var hasPage = false;
fs.readFile(file, 'utf8', function (err, data) {
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
    blockArray = [],
    headArray = [];
  for (i = 0; i < cmdArray.length; i++) {
    // Does stuff based on commands
    var cmd = cmdArray[i].cmd;
    joinedCmd = cmd.join(' '); // For error messages
    line = cmdArray[i].line;
    // /!(start/end) div
    if (cmd[1] == 'div') {
      command = '';
      command = cmd.join(' ');
      dataArray[line] = "\n/!" + command + '\n'; // Splits command away from other parts so it doesn't get parsed into another line
    }
    else if (cmd[0] == 'selector' || cmd[1] == '/!selector' || cmd[0] == '/!selector') {} // Makes the else statement at the bottom not trigger for selectors
    // /!start
    else if (cmd[0] == 'start') {
      if (cmd[1] == undefined) {
        return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo start specified'); // Error for if no page name
      }
      // /!start page
      else if (cmd[1] == 'page') {
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo page specified'); // Error for if no page name
        } else {
          page = cmd[2];
          start = line + 1; // Start 1 line after start command
          hasPage = true;
        }
      }
    }
    // /!end
    else if (cmd[0] == 'end'){
      if (cmd[1] == undefined) {
        return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo end specified'); // Error for if no page name
      }
      // /!end page
      else if (cmd[1] == 'page') {
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo page specified'); // Error for if no page name
        }
        else if (cmd[2] != page) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\n' + cmd[1] +  ' was never started or another page was started between them'); // Error for if page block wasn't started
        } else {
          end = line - 1; // End 1 line before end command
          blockArray.push({page: page, start: start, end: end});
        }
      }
    }
    // /!head
    else if (cmd[0] == 'head') {
      headArray.push(cmd); // Puts head info in it's own line
      dataArray[line] = ''; // Removes it from data
    } else {
      return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNot a valid command'); // Error for if no command
    }
  }
  if (hasPage) { // If no page commands are in the file
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
    var head = headArray[i];
    var resultArray, divArray = [];
    var tabLength = 2;
    var result = '';
    resultArray = md.render(page.data).split('\n'); // Renders Markdown into HTML and splits it

    var title = '';
    var viewport = '';
    var script = '';
    var link = '';
    for (var z = 0; z < head.length; z++) {
      var headTag = head[z];
      headTag = headTag.split(':');
      if (headTag[0] == 'title') {
        title = '\t\t<title>' + headTag[1] + '</title>\n';
      }
      if (headTag[0] == 'link') {
        link += '\t\t<link rel="stylesheet" href="'+ headTag[1] + '">\n';
      }
      if (headTag[0] == 'viewport') {
        viewport = '\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
      }
      if (headTag[0] == 'script') {
        script += '\t\t<script src="' + headTag[1] + '" charset="utf-8"></script>\n';
      }
    }

    var top = '<!DOCTYPE html>\n';
    top += '<html lang="en" dir="ltr">\n';
    top += '\t<head>\n';
    top += '\t\t<meta charset="utf-8">\n';
    top += title + link + viewport;
    top += '\t</head>\n';
    top += '\t<body>';

    var bottom = script;
    bottom += '\t</body>\n';
    bottom += '</html>';

    resultArray.splice(0, 0, top);
    resultArray.splice(-1, 0, bottom);

    for (p = 0; p < resultArray.length - 1; p++) {
      line = resultArray[p];
      var starting = /<.+>\/!/, // Looks for <[tag]>/!
      pounds, periods, id = '';
      if (starting.test(line)) { // Finds all of the post-parsing commands
        var tagArray = starting.exec(line); // exec returns what was found in string
        var StartingTag = tagArray[0]; // Gets what was found for <[tag]>/!
        var StartingTagLen = StartingTag.length;

        element = StartingTag.substring(1, StartingTagLen - 3); // Gets element name

        backTag = (line.length - element.length - 3); // For removing the closing tag; </[tag]>

        aftCommand = line.substring(StartingTagLen, backTag).split(' ');

        var twoSelectors = false;
        // /!(start/end) div
        if (aftCommand[1] == 'div') {
          // /!start div
          if (aftCommand[0] == 'start') {

            if (aftCommand[2] == undefined) {
              line = '<div>';
            }
            var div = '<div';
            // format: <div class="" id="">
            // If ID's come before classes or if there are id's but no classes
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '#') {
              if (aftCommand[3]) { // If there are classes
                periods = aftCommand[3].substring(1).split('.').join(' ');
                div += ' class="' + periods + '"';
              }
              pounds = aftCommand[2].substring(1).split('#').join(' ');
              div += ' id="' + pounds + '">';
              line = div;
            }
            // If classes come before id's, or if there are classes and no id's
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '.') {
              if (aftCommand[3]) { // If there are ID's
                pounds = aftCommand[3].substring(1).split('#').join(' ');
                id = ' id="' + pounds + '"';
              } else {
                id = '';
              }
              pounds = aftCommand[2].substring(1).split('.').join(' ');
              div += ' class="' + pounds + '"' + id + '>';
              line = div;
            }
          }

          // /!end div
          else if (aftCommand[0] == 'end') {
            line = '</div>'; // Replaces line
          }
        }

        // /!selector .class #id
        else if (aftCommand[0] == 'selector'){
          var HTMLtag = '<' + element;
          // If ID's come before classes or if there are no classes
          if (aftCommand[1] && aftCommand[1].substring(0, 1) == '#') {
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '.') { // If there are classes
              periods = aftCommand[2].substring(1).split('.').join(' ');
              HTMLtag += ' class="' + periods + '"';
              twoSelectors = true;
            }
            pounds = aftCommand[1].substring(1).split('#').join(' ');
            HTMLtag += ' id="' + pounds + '">';
          }
          // If classes come before ID's or if there are no ID's
          if (aftCommand[1] && aftCommand[1].substring(0, 1) == '.') {
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '#') { // If there are ID's
              pounds = aftCommand[2].substring(1).split('#').join(' ');
              id = ' id="' + pounds + '"';
              twoSelectors = true;
            } else {
              id = '';
            }
            pounds = aftCommand[1].substring(1).split('.').join(' ');
            HTMLtag += ' class="' + pounds + '"' + id + '>';
          }
          var elementText = '';
          if (twoSelectors) {
            elementText = aftCommand.splice(3).join(' ');
            line = HTMLtag + elementText + '</' + element + '>';
          } else {
            elementText = aftCommand.splice(2).join(' ');
          }
          line = HTMLtag + elementText + '</' + element + '>';
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
      if (p == 0 || p == (resultArray.length - 2)) { // If it is the first line (head info) or the last (HTML and body end tags)
        tab = '';
      }
      result += tab + line + '\n'; // Makes it a part of result variable
    }
    // writes result to file
    /* jshint ignore:start */ // Removes jshint error with the function statement
    fs.writeFile(page.page, result, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
    });
    /* jshint ignore:end */
    console.log('Made ' + page.page);
  }
});
