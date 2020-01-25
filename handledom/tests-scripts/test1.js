const { compileHandledom } = require("../compiled-cjs/api.compiler")
const { js: beautify } = require('js-beautify')

function codeOf(source) {
  const minified = compileHandledom(source)
  const beautified = beautify(minified, {
    indent_size: 2,
    space_after_anon_function: true
  })
  console.log("========")
  console.log(source.trim() + "\n")
  console.log(beautified)
  // console.log("\n" + minified)
}

codeOf(`
<div>
  <p>{{ message }}</p>
</div>
`)