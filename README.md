# MarkDown Markup Parser (MDMP) v1.0.1
This is a markdown parser that uses NodeJS and [Markdown-it](https://github.com/markdown-it/markdown-it). It's main feature is that you can make multiple HTML pages in one Markdown file.


## How to use:

### Installing:

#### From NPM:
1. Run `npm install -g markdown-markup-parser` to download this package and dependencies
1. Once NPM is finished installing, run `mdmp --init`  to make `index.md` with starting syntax
1. Start using markdown!
1. Once you have a page you want, simply run `mdmp` to parse the markdown file into a html file

#### From Git or GitHub:
1. Run `npm i` in directory to install modules
  - Optional: Run `npm install -g /path/to/directory` to use this module globally. If this is done, follow the steps in 'From NPM'
1. Once NPM is finished installing packages, run `node mdmp.js --init` to make `index.md` with starting syntax
1. Start using markdown!
1. Once you have a page you want, simply run `node mdmp.js` and the program will parse the markdown file into a html file


### Syntax:
#### Syntax can be found [here](syntax.md)
An example of the syntax in use can be found at [examples/index.md](https://raw.githubusercontent.com/trevor34/markdown-website-builder/master/examples/index.md).

### Command line flags
- --help, -h: Display help message
- --file, -f: Specify markdown file to read from (default: index.md in current directory)
- --dest, -d: Specify where you want files to be made (default: current directory)
- --tag, -t: Specify command tags (default: /!)
- --init: make a new markdown file with starters
- --mdhelp, -m: Get help for markdown parsing commands
- --version, -v: View version number



Want to contribute? Check out [CHANGELOG.md](CHANGELOG.md) and [CONTRIBUTING.md](CONTRIBUTING.md)
