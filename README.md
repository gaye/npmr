npmr
====

npmr solves some deficiences in the implementation of local modules in
npm 2. It aspires to be deprecated once similar functionality lands in npm.

### Installation

`npm install -g npmr`

### Commands

```
/**
 * Like `npm install` except will notice if changes have been
 * made to local modules and update them. Run from within module dir.
 */
npmr install

/**
 * Like `npm ls` except only prints local modules.
 */
npmr ls

/**
 * Like `npm publish` but replaces package dependencies specified
 * by local paths with their version so we can publish to npm.
 */
npmr publish
```
