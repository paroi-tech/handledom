This directory contains code that manually runs the compiler. Just for testing purpose.

Start the compiler in watcher mode:

```sh
npm run tsc:watch --prefix handledom
```

Create a JS file:

```js
// test-scripts/test1.js
const { compileHandledom } = require("../compiled-cjs/api.compiler")
const { js: beautify } = require('js-beautify')

function showCodeOf(source) {
  const minified = compileHandledom(source)
  const beautified = beautify(minified, {
    indent_size: 2,
    space_after_anon_function: true
  })
  console.log("========")
  console.log(source.trim() + "\n")
  console.log(beautified)
  console.log("\n" + minified)
}

showCodeOf(`
<div>
  <p class={{ className }}>{{ message }}</p>
</div>
`)
```

Then, execute your script:

```sh
node handledom/test-scripts/test1.js
```

All files in this directory are in `.gitignore` (except `README.md`).
