import { findHandledomTemplateStrings } from "../src/find-handledom-template-strings"

describe("Spec for 'find-handledom-template-strings'", () => {
  test("starts at first character", () => {
    const source = `const template = handledom\`<p></p>\``
    const result = findHandledomTemplateStrings(source)
    expect(result.length).toBe(1)
  })

  test("in a function", () => {
    const source = `
function f() {
  const template = handledom\`<p></p>\`
}
`
    const result = findHandledomTemplateStrings(source)
    expect(result.length).toBe(1)
  })

  test("with an invalid prefix", () => {
    const source = `
aconst template = handledom\`<p></p>\`
`
    const result = findHandledomTemplateStrings(source)
    expect(result.length).toBe(0)
  })

  test("2 templates", () => {
    const source = `
const template1 = handledom\`<p></p>\`
const template2 = handledom\`<span></span>\`
`
    const result = findHandledomTemplateStrings(source)
    expect(result.length).toBe(2)
  })
})