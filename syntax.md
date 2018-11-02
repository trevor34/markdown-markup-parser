### Syntax
Do not include the angle brackets when using commands.
#### Page syntax
These tags denote the start and end of HTML pages. They cannot be nested
- `/!start page <page>`: Start new page
- `/!end page <page>`: End page
___
##### Tags
Tags refer to HTML elements and Markdown syntax
##### Selectors
The following syntax can use selectors. Selectors refer to HTML classes and ID's. Classes and ID's are called to exactly like CSS. Example:

`.class`

`#id`

They can be put in any order after a tag:

`.class #id`

`#id .class`

And one element can have multiple tags, just like HTML:

`.class.class2`

`#id#id2`

#### Multi-line tag syntax
- `/!start <tag> <optional: selectors>`
- `/!end <tag> <optional: selectors>`
#### Single-line tag syntax
For elements that do not have Markdown equivalents, such as span tags, you can use these:
- `/!<tag> <optional: selectors> <text>`
You can also give selectors to elements that have Markdown equivalents except for anchor tags and img tags, as they have not been implemented yet. Example:
- `<md tag> <selectors> <text>`
#### Head tag syntax:
This tag denotes HTML tags that go in the head of the document. It is set up as `/!head <tags>`. For certain tags, they must be connected to the call, such as `link:styles.css` The possible tags are as follows:
- `title:<title>`: Names the document. Defaults as the name of the page. As of right now, the title cannot be more than one word.
- `link:<stylesheet>`: Links external stylesheets. Can be local files or files from a CDN, such as Bootstrap.
- `viewport`: Sets a viewport meta tag for the HTML document. More info can be learned [here](https://www.w3schools.com/css/css_rwd_viewport.asp)
- `script:<JavaScript document>`: Links external JavaScript documents. Can be local files or files from a CDN, such as jQuery. If this tag is called, it is put at the bottom of the HTML document.

#### Escape character
The escape character can be used on any parsing command. The escape character is `\`. An escape character is not needed if it is not in the first column. Examples:
- `\/!span This is an escaped span tag`
- `\/!page start nothing`
- `You do not need an escape character for this /!span`