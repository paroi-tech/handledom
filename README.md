# handledom-template-in-string-loader

Compile Handledom templates in template strings at build time.

It allows to write single file components in standard JavaScript and TypeScript source files.

## How to use

First, add `handledom-template-in-string-loader` to a webpack config file:

```sh
npm install handledom-template-in-string-loader --save-dev
```

In the `webpack.config.js` file, add this rule:

```js
  module.exports = {
    module: {
      rules: [
        { 
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          use: ['handledom-template-in-string-loader']
        }
      ]
    }
  };
```

## Contribute

With VS Code, our recommanded plugin is:

* **TSLint** from Microsoft (`ms-vscode.vscode-typescript-tslint-plugin`)
