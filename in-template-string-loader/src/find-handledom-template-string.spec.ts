import { findHandledomTemplateString } from "./find-handledom-template-string"

describe("Spec for 'find-handledom-template-string'", () => {
  test("starts at first character", () => {
    const source = `const template = handledom\`<p></p>\``
    const result = findHandledomTemplateString(source)
    expect(result).toBeDefined()
  })

  test("in a function", () => {
    const source = `
function f() {
  const template = handledom\`<p></p>\`
}
`
    const result = findHandledomTemplateString(source)
    expect(result).toBeDefined()
  })

  test("with an invalid prefix", () => {
    const source = `
aconst template = handledom\`<p></p>\`
`
    const result = findHandledomTemplateString(source)
    expect(result === undefined)
  })
})