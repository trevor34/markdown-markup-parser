# markdown-website-builder v0.6.1
This is a website builder that uses NodeJS and [Markdown-it](https://github.com/markdown-it/markdown-it). It's main feature so far is that you can make multiple HTML pages in one Markdown file.


## How to use:

### Installing:
1. Install NodeJS and NPM
1. Run `npm i` in the file's directory
1. Once NPM is finished installing packages, run `node website-maker.js --init` to make `index.md` with starting syntax
1. Start using markdown!
1. Once you have a page you want, simply run `node website-maker.js` and the program will parse the markdown file into a html file

### Syntax:
All commands are started with `/!` in the format `/!<command>`. Do not include the angle brackets when using commands
#### Page syntax:
These tags denote the start and end of HTML pages. They cannot be nested
- `start page <page>`: Start new page
- `end page <page>`: End page
#### Div tag syntax:
These tags denote the start and end of div tags. They can be nested and can also be named with periods (`.`) and pound signs (`#`) for classes and id's respectively.
To name a div, just simply put a `.` or `#` in front of the name as `.class` or `#id`. As of right now, a div cannot have both an id and a class, or multiple classes and id's. If no period or pound sign is given, but the div is named, it defaults to a class. If the div is not named, it will be parsed as `<div>`. End div tags do not need to be named, but it may help with organization if you do.
- `start div <optional: name>`: Starts div
- `end div <optional: name>`: Ends div

### Command line flags
- --help, -h: Display help message
- --file, -f: Specify markdown file to read from (default: index.md in current directory)
- --dest, -d: Specify where you want files to be made (default: current directory)
- --tag, -t: Specify command tags (default: /!)
- --init: make a new markdown file with starters
- --mdhelp: Get help for markdown parsing commands

An example of the syntax in use can be found at [examples/index.md](examples/index.md).

I recommended checking out [the raw version](https://raw.githubusercontent.com/trevor34/markdown-website-builder/master/examples/index.md) as well due to some of the syntax not showing up

Want to contribute? Check out the [Changelog file](CHANGELOG.md)
