#### Linting:
- Use eslint and ES 6. A good Atom package to use is [linter-eslint](https://atom.io/packages/linter-eslint). Install any dependencies it says it requires. If installed through Atom, they will pop up in a window after installing. The program must show no errors or warnings to pass a pull request, but some exceptions may be made.

#### Formatting mdmp.js:
- Soft tabs at 2 spaces, one tab per indent.
- Use `/* */` comments for headers explaining large chunks of code, and `//` comments for explaining bits of code

#### Formatting examples/index.md
- Any changes or additions to parsing must be shown as a simple example in [examples/index.md](examples/index.md), preferably in the index page section.

#### Testing
- Use `npm test` to test changes in `examples/`
