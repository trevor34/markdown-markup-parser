#!/usr/bin/env node

/*
 * Markdown Markup Parser - v1.1.2
 * Created by: Trevor W.
 * Github: https://github.com/trevor34/markdown-markup-parser/
 */

const fs = require('fs'); // For reading a file
const MarkdownIt = require('markdown-it'); // Turns Markdown into HTML
const md = new MarkdownIt();
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

const options = commandLineArgs(optionDefinitions);

/*
 * Command Line Flags
 * Help commands
 */

// --version, -v
if (options.version) {
  console.log('v1.1.2');
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
  Page syntax:
    start page <page>: Start new page
    end page <page>: End page
  Multi line tag syntax:
    start <tag> <optional: selectors>: Starts element
    end <tag> <optional: selectiors>: Ends elemen

  Single line tag syntax:
    <tag> <optional: selectors> <text>
    Tags can also be markdown's default syntax, without /!

  Selector format examples:
    .class.class2 #id#id2
    #id#id2 .class.class2
    #id
    .class

For more info, check out https://github.com/trevor34/markdown-markup-parser/blob/master/syntax.md
  `);
  process.exit();
}

// --init
var file = 'index.md';
if (options.init) {
  var starter = `/!start index
/!head title:index.html

/!end index`;
  fs.writeFileSync(file, starter, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }
  });
  console.log('\n\tindex.md made with starting syntax\n');

  process.exit();
}

// Program commands

// --file, -f
if (typeof options.file != 'undefined') {
  file = options.file;
}

// --dest, -d
var dest = '';
if (typeof options.dest == 'undefined') {
  dest = '';
} else {
  dest = options.dest;
}

// --tag, -t
var tag = '';
if (typeof options.tag == 'undefined') {
  tag = '/!';
} else {
  tag = options.tag;
}

// Main program
var hasPage = false;
fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var dataArray = data.split('\n'); // Split at each new line
  var cmdArray = [];

  for (var i = 0; i < dataArray.length; i++) {
    // Finds all parsing commands and puts them in an array
    var string = dataArray[i];
    var regTag = new RegExp('.*' + tag, "u");
    if (regTag.test(string)) { // Searches for the command starter
      var regArray = regTag.exec(string);
      string = regArray.input.substring(regArray[0].length, regArray.input.length); // Makes it only the command
      var command = string.split(' ');
      cmdArray.push({cmd: command, line: i});
    }
  }


  var pageName = '', // Declaring variables
    start, end, line = 0,
    blockArray = [],
    headArray = [];
  for (i = 0; i < cmdArray.length; i++) {
    // Does stuff based on commands
    var cmd = cmdArray[i].cmd;
    var joinedCmd = cmd.join(' '); // For error messages
    line = cmdArray[i].line;
    // /!(start/end)
    if (cmd[1] != 'page' && cmd[0] != 'head') {
      dataArray[line] = "\n" + dataArray[line] + '\n'; // Splits command away from other parts so it doesn't get parsed into another line
    }
    // /!start
    else if (cmd[1] == 'page') {
      if (cmd[0] == 'start') {
        if (cmd[1] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo start specified'); // Error for if no page name
        }
        // /!start page
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo page specified'); // Error for if no page name
        }
        pageName = cmd[2];
        start = line + 1; // Start 1 line after start command
        hasPage = true;
      }
      else if (cmd[0] == 'end') {
        if (cmd[2] == undefined) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNo page specified'); // Error for if no page name
        }
        else if (cmd[2] != pageName) {
          return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\n' + cmd[1] + ' was never started or another page was started between them'); // Error for if page block wasn't started
        }
        end = line - 1; // End 1 line before end command
        blockArray.push({page: pageName, start, end});
      }
    }
    // /!head
    else if (cmd[0] == 'head') {
      headArray.push(cmd); // Puts head info in it's own line
      dataArray[line] = ''; // Removes it from data
    } else if (!joinedCmd.includes('selector')) {
      return console.log('Traceback: '+ (line + 1) + ': ' + tag + joinedCmd + '\nParsing error\nNot a valid command'); // Error for if no command
    }
  }
  if (!hasPage) { // If no page commands are in the file
    blockArray.push({page: 'index', start: 0, end: dataArray.length - 1});
    console.log('There are no parsing commands. Parsing into index.html');
  }
  var pageArray = [];
  // Puts everything that goes to a page into one string and makes a new array with the page name and that string
  for (i = 0; i < blockArray.length; i++) {
    var text = '';
    for (var p = blockArray[i].start; p <= blockArray[i].end; p++) { // From start of page to end of page
      text += dataArray[p] + '\n';
    }
    pageArray.push({page: dest + blockArray[i].page + '.html', data: text});
  }
  for (i = 0; i < pageArray.length; i++) { // Makes all of the pages
    var page = pageArray[i];
    var head = headArray[i];
    var resultArray = [];
    var tabLength = 2;
    var result = '';
    resultArray = md.render(page.data).split('\n'); // Renders Markdown into HTML and splits it

    var title = '';
    var viewport = '';
    var script = '';
    var link = '';
    for (var z = 0; z < head.length; z++) {
      var headTag = head[z];
      var reghead = /((.+):\b(.+)|.+[^:])/u; // Looks for [text]:[text] or [text] without :. Fixes problem that arises when a CDN is used in a link or script tag
      var HTarray = reghead.exec(headTag);
      if (HTarray[2] == 'title') {
        title = '\t\t<title>' + HTarray[3] + '</title>\n';
      }
      if (HTarray[2] == 'link') {
        link += '\t\t<link rel="stylesheet" href="'+ HTarray[3] + '">\n';
      }
      if (HTarray[1] == 'viewport') {
        viewport = '\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
      }
      if (HTarray[2] == 'script') {
        script += '\t\t<script src="' + HTarray[3] + '" charset="utf-8"></script>\n';
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
      var starting = /<(.+)>(\/!|\.|#)/u, // Looks for <[tag]>/! or . or #
      pounds, periods, id = '';
      if (starting.test(line)) { // Finds all of the post-parsing commands
        var tagArray = starting.exec(line); // exec returns what was found in string
        var element = tagArray[1];
        var StartingTag = tagArray[0]; // Gets what was found for <[tag]>/!
        var StartingTagLen = '';
        if (tagArray[2] == '.' || tagArray[2] == '#') {
          StartingTagLen = StartingTag.length - 1;
        } else {
          StartingTagLen = StartingTag.length;
        }

        var backTag = line.length - element.length - 3; // For removing the closing tag; </[tag]>

        var aftCommand = line.substring(StartingTagLen, backTag).split(' ');

        var twoSelectors = false;

        /* Multi-line tags */
        // /!start
        if (aftCommand[0] == 'start') {

          var topTag = '<' + aftCommand[1];

          // format: <[tag] class="" id="">

          // If ID's come before classes or if there are id's but no classes
          if (aftCommand[2] && aftCommand[2].substring(0, 1) == '#') {
            if (aftCommand[3]) { // If there are classes
              periods = aftCommand[3].substring(1).split('.');
              periods = periods.join(' ');
              topTag += ' class="' + periods + '"';
            }
            pounds = aftCommand[2].substring(1).split('#');
            pounds = pounds.join(' ');
            topTag += ' id="' + pounds + '"';
          }
          // If classes come before id's, or if there are classes and no id's
          if (aftCommand[2] && aftCommand[2].substring(0, 1) == '.') {
            if (aftCommand[3]) { // If there are ID's
              pounds = aftCommand[3].substring(1).split('#');
              pounds = pounds.join(' ');
              id = ' id="' + pounds + '"';
            } else {
              id = '';
            }
            periods = aftCommand[2].substring(1).split('.');
            periods = periods.join(' ');
            topTag += ' class="' + periods + '"' + id;
          }

          topTag += '>';
          line = topTag;
        }

        // /!end
        else if (aftCommand[0] == 'end') {
          line = '</' + aftCommand[1] + '>'; // Replaces line
        }

        /* Single Line tags and selectors */
        else {
          if (aftCommand[0].substring(0, 1) == '.' || aftCommand[0].substring(0, 1) == '#') {
            aftCommand.splice(0, 0, 'placeholder'); // Keeps first line from being ignored
          } else if (aftCommand[0] != 'selector') { // For custom single line tags
            element = aftCommand[0];
          }

          var HTMLtag = '<' + element;

          // If ID's come before classes or if there are no classes
          if (aftCommand[1] && aftCommand[1].substring(0, 1) == '#') {
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '.') { // If there are classes
              periods = aftCommand[2].substring(1).split('.');
              periods = periods.join(' ');
              HTMLtag += ' class="' + periods + '"';
              twoSelectors = true;
            }
            pounds = aftCommand[1].substring(1).split('#');
            pounds = pounds.join(' ');
            HTMLtag += ' id="' + pounds + '"';
          }
          // If classes come before ID's or if there are no ID's
          else if (aftCommand[1] && aftCommand[1].substring(0, 1) == '.') {
            if (aftCommand[2] && aftCommand[2].substring(0, 1) == '#') { // If there are ID's
              pounds = aftCommand[2].substring(1).split('#');
              pounds = pounds.join(' ');
              id = ' id="' + pounds + '"';
              twoSelectors = true;
            } else {
              id = '';
            }
            periods = aftCommand[1].substring(1).split('.');
            periods = periods.join(' ');
            HTMLtag += ' class="' + periods + '"' + id;
          } else { // If no classes or id's are present
            aftCommand.splice(0, 0, ''); // Puts a space on the first item so it doesn't get deleted
          }
          HTMLtag += '>';
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

      /* Tab instertion - Gives HTML document a regular and readable look */
      // Finds start and end tags and inserts tabs based on the number it is at
      var tab = '';
      var startTag = /<[^/].+>/u; // everything inside angle brakets not including a '/' (start tags)
      var endTag = /<\/.+>/u; // everything inside angle brakets including '/' (end tags)

      if (endTag.test(line) && !startTag.test(line)) { // If line has end tag and not start tag. Effects current line
        tabLength -= 1;
      }
      for (var j = 0; j < tabLength; j++) { // Makes tabs based on tabLength number
        tab += '\t';
      }
      if (startTag.test(line) && !endTag.test(line)) { // If line has start tag and not end tag. Effects next line
        tabLength += 1;
      }
      if (p == 0 || p == resultArray.length - 2) { // If it is the first line (head info) or the last (HTML and body end tags)
        tab = '';
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
