# @handledom/in-template-string-loader

[![Build Status](https://travis-ci.com/paroi-tech/handledom.svg?branch=master)](https://travis-ci.com/paroi-tech/handledom)
[![npm](https://img.shields.io/npm/dm/handledom)](https://www.npmjs.com/package/@handledom/in-template-string-loader)
[![GitHub](https://img.shields.io/github/license/paroi-tech/handledom)](https://github.com/paroi-tech/handledom)

A webpack loader that compiles Handledom templates in template strings at build time.

## How to use

First, add `@handledom/in-template-string-loader` to a webpack config file:

```sh
npm install @handledom/in-template-string-loader --save-dev
```

In the `webpack.config.js` file, add this rule:

```js
module.exports = {
  // …
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: "@handledom/in-template-string-loader"
      },
    ]
  }
};
```

## Contribute

With VS Code, our recommanded plugin is:

- **ESLint** - `dbaeumer.vscode-eslint`
- **Prettier** - `esbenp.prettier-vscode`
