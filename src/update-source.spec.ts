import { updateSource, UpdateSourceOptions } from "./update-source"

describe("Tests of 'update-source'", () => {
  const options: UpdateSourceOptions = {
    fileName: "file1.js",
    filePath: "a/b/c/file1.js"
  }

  test("with basic template string", () => {
    const source = `const template = handledom\`<div class="abc" :ref="div">
  <script>
    console.log("Hello template...")
  </script>
  {{ firstPlaceHolder }}
  <br> This a text
  <!-- This is a comment -->
  <header>This is the header</header>
  <p class="what" :ref="p">This is the main content</p>
  <style>
    background-color: #ffa;
  </style>
  {{ secondPlaceholder }} And another text
</div>\``
    const result = updateSource(source, options)
    console.log(result)
    expect(result).toBeDefined()
  })
})