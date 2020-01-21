# handledom

[![Build Status](https://travis-ci.com/tomko-team/handledom.svg?branch=master)](https://travis-ci.com/tomko-team/handledom)
[![npm](https://img.shields.io/npm/dm/handledom)](https://www.npmjs.com/package/handledom)
![Type definitions](https://img.shields.io/npm/types/handledom)
[![GitHub](https://img.shields.io/github/license/tomko-team/handledom)](https://github.com/tomko-team/handledom)

An HTML template engine for DOM lovers.

## How to use with Webpack

Handledom templates will be compiled at build time by Webpack.

Install:

```sh
# Install Handledom and its webpack plugin
npm i handledom
npm i -D @handledom/in-template-string-loader

# Install classic webpack packages
npm i -D webpack webpack-cli
```

In `webpack.config.js`:

```js
module.exports = {
  // …
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["@handledom/in-template-string-loader"]
      },
    ]
  }
}
```

In a source file:

```ts
import handledom from "handledom"

const template = handledom`<p>Hello, {{ name }}!</p>`

const { root, update } = template({
  name: "Steve"
})

document.body.append(root)
```

## Configure Webpack to use Handledom with TypeScript

In `webpack.config.js`:

```js
module.exports = {
  // …
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["@handledom/in-template-string-loader", "ts-loader"]
      },
    ]
  }
}
```

## How to use with compilation on the browser

Handledom templates can be compiled at runtime on the browser. Here is how to do:

Install `handledom`:

```sh
npm i handledom
```

In a source file:

```ts
import handledom from "handledom/browser"

const template = handledom`<p>Hello, {{ name }}!</p>`

const { root, update } = template({
  name: "Steve"
})

document.body.append(root)
```

## Contribute

### Install and Build

We need a JVM (Java Virtual Machine) to build the parser because we use [ANTLR](https://www.antlr.org/), which is a Java program. So, at first, install a JVM on your system.

In a terminal, open the cloned `handledom/handledom/` repository. Then:

```sh
# Download once the ANTLR JAR file in the project's root directory
wget https://www.antlr.org/download/antlr-4.7.2-complete.jar

# Install once all Node.js dependencies
npm install
```

### Development environment

With VS Code, our recommanded plugins are:

- **ANTLR4 grammar syntax support** from Mike Lischke (`mike-lischke.vscode-antlr4`)
- **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
