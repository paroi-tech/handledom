const beautify = require("js-beautify").js
import { compileHandledom, parseHandledom } from "./api"

const options = {
  indent_size: 2,
  max_preserve_newlines: 2,
  end_with_newline: true
}

const template = `
  <div class="abc" :ref="$div">
    <script>
      console.log("Hello template...")
    </script>
    {{ firstPlaceHolder }}
    <br> This a text
    <!-- This is a comment -->
    <header>This is the header</header>
    <p class="what" :ref="p" id={{ elementId }}>This is the main content</p>
    <style>
      background-color: #ffa;
    </style>
    <div :ref="$div"></div>
    {{ secondPlaceholder }} And another text &amp;
  </div>
`

console.log(beautify(compileHandledom(template), options))

const template2 = `
  <div class="Abc">
    <p>a <em>&amp; <span>{{ name }}</span></em> c</p>
  </div>
`
// console.log(beautify(compileHandledom(template2), options))

const template3 = `
  <div>
    <header>This is a template without var</header>
    <p>&amp; this is its content</p>
  </div>
`
// console.log(beautify(compileHandledom(template3), options))

const template4 = `<p bobo="abc"> a  bc <em> toto </em> { yop } {{ yop }} d &amp; ef </p>`
console.log(template4, "\n", JSON.stringify(parseHandledom(template4), undefined, 2))

// const template5 = `
//     <div>
//       <p class={{ foo }}>{{ bar }}</p>
//     </div>
//   `
// console.log(template5, "\n", JSON.stringify(parseHandledom(template5), undefined, 2))
