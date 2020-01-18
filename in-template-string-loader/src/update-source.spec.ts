import { updateSource } from "./update-source"

describe("Tests of 'update-source'", () => {
  test("with basic template string", () => {
    const source = `const template = handledom\`<div class="abc" :ref="div">
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
    const result = updateSource(source)
    // console.log(result)
    expect(result).toBeDefined()
  })
})