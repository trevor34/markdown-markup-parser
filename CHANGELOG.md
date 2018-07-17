# CHANGELOG
All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


		Markdown Markup Parser (MDMP) - v0.8.1
		Created by: Trevor W.

		Github: https://github.com/trevor34/markdown-markup-parser/

## Types of changes
    [Added] for new features.
    [Changed] for changes in existing functionality.
    [Deprecated] for soon-to-be removed features.
    [Removed] for now removed features.
    [Fixed] for any bug fixes.
    [Security] in case of vulnerabilities.


## [Unreleased] - Upcoming Changes, Current Projects, and 'wish list' items
- Add HTML tag support besides what is parseable with markdown-it
## [0.8.1] 2018-7-17
## Fixed
- Files not parsing correctly if there is no page syntax
## Added
- Command line flag for version number: `--version, -v`
## Changed
- Changed install instructions to use npm's global flag
- Made version numbers more consistent
## [0.8.0] 2018-7-16
## Added
- Added support for selectors on items besides divs with the `/!selector` command
## [0.7.0] 2018-7-07
## Changed
- Changed GitHub title to Markdown Markup Parser from Markdown Website Builder
- Changed filename to mdmp.js from website-builder.js
## Added
- Full HTML page support
- Multiple class and id tags
- Head tag command including
	- title
	- link
	- script
	- viewport meta tag

## [0.6.1] 2018-7-05
## Added
- Updated --mdhelp flag
## [0.6.0] 2018-7-03
## Added
- HTML div tag support
- Explanation in readme file
## [0.5.0] 2018-5-24
## Added
- Option for if no parsing commands are in the md file
## [0.4.1] 2018-5-24
## Added
- Added more comments
## [0.4.0] 2018-5-21
## Added
- Command line flag for markdown parsing help
## Fixed
- Tabbing error
## [0.3.0] 2018-5-19
### Added
- Correct indenting to HTML files
- command tags can now be redefined with the `--tag` flag in the terminal
## Changed
- Changed default command tags. They are now `/!`
## [0.2.0] 2018-5-18
### Added
- Made base program, along with an example page
- Updated readme
## [0.1.0] 2018-5-18
### Added
- Set up GitHub page
