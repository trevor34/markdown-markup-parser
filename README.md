# MarkDown Markup Parser (MDMP) v0.7
This is a markdown parser that uses NodeJS and [Markdown-it](https://github.com/markdown-it/markdown-it). It's main feature is that you can make multiple HTML pages in one Markdown file.


## How to use:

### Installing:
1. Install NodeJS and NPM
1. Run `npm i` in the file's directory
1. Once NPM is finished installing packages, run `node mdmp.js --init` to make `index.md` with starting syntax
1. Start using markdown!
1. Once you have a page you want, simply run `node mdmp.js` and the program will parse the markdown file into a html file

### Syntax:
All commands are started with `/!` in the format `/!<command>`. Do not include the angle brackets when using commands
#### Page syntax:
These tags denote the start and end of HTML pages. They cannot be nested
- `start page <page>`: Start new page
- `end page <page>`: End page
#### Div tag syntax:
These tags denote the start and end of div tags. They can be nested and can also be named with periods (`.`) and pound signs (`#`) for classes and id's respectively.
To name a div, just simply put a `.` or `#` in front of the name as `.class` or `#id`. You can give a div multiple classes and id's, and can be placed in any order after `/!start div`. The only requirement is that classes and id's must be separated from each other and must be in a group as so:

`/!start div #id#idTwo .class.classTwo`

or alternatively;

`/!start div .class.classTwo #id#idTwo`

Classes and id's must have a `.` or `#` respectively. If the div is not named, it will be parsed as `<div>`. End div tags do not need to be named, but it may help with organization if you do.
- `start div <optional: name>`: Starts div
- `end div <optional: name>`: Ends div

#### Head tag syntax:
This tag denotes HTML tags that go in the head of the document. It is set up as `/!head <tags>`. For certain tags, they must be connected to the call, such as `link:styles.css` The possible tags are as follows:
- `title:<title>`: Names the document. Defaults as the name of the page. As of right now, the title cannot be more than one word.
- `link:<stylesheet>`: Links external stylesheets. Can be local files or files from a CDN, such as Bootstrap.
- `viewport`: Sets a viewport meta tag for the HTML document. More info can be learned [here](https://www.w3schools.com/css/css_rwd_viewport.asp)
- `script:<JavaScript document>`: Links external JavaScript documents. Can be local files or files from a CDN, such as jQuery. If this tag is called, it is put at the bottom of the HTML document.

### Command line flags
- --help, -h: Display help message
- --file, -f: Specify markdown file to read from (default: index.md in current directory)
- --dest, -d: Specify where you want files to be made (default: current directory)
- --tag, -t: Specify command tags (default: /!)
- --init: make a new markdown file with starters
- --mdhelp, -m: Get help for markdown parsing commands

An example of the syntax in use can be found at [examples/index.md](https://raw.githubusercontent.com/trevor34/markdown-website-builder/master/examples/index.md).

Want to contribute? Check out the [Changelog file](CHANGELOG.md)
