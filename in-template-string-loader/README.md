# @handledom/in-template-string-loader

[![Build Status](https://travis-ci.com/tomko-team/handledom.svg?branch=master)](https://travis-ci.com/tomko-team/handledom)
[![npm](https://img.shields.io/npm/dm/handledom)](https://www.npmjs.com/package/@handledom/in-template-string-loader)
[![GitHub](https://img.shields.io/github/license/tomko-team/handledom)](https://github.com/tomko-team/handledom)

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

* **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
