import { compileHandledom } from "../src/api"
import { generateCode } from "../src/function-builder"
import { parseHandledom } from "../src/parse-handledom"
import { AstElement } from "../types/ast"

describe("AST Specification", () => {

  test("Simple template", () => {
    const template = `<p>Hello, {{ name }}!</p>`
    const compiled = compileHandledom(template)
    // console.log(compiled)
    expect(compiled !== template)
  })

  test("mismatched tags", () => {
    const template = `
    <div>
      <header>{{ title }}</header>
      <p>{{ content }}</p>
    </nav>
  `
    expect(() => parseHandledom(template)).toThrow()
  })

  test("empty tag template", () => {
    const template = `<input class="email-input" placeholder="Email">`
    const ast = parseHandledom(template)
    expect(ast.nodeType).toBe("element")
    expect(ast.nodeName).toBe("input")
    expect(ast.attributes?.length).toBe(2)
  })

  test("empty tag with children", () => {
    const template = `
    <br>
      <div>Some content</div>
    </br>
  `
    expect(() => parseHandledom(template)).toThrow()
  })

  test("element with no content", () => {
    expect(parseHandledom(`<p></p>`)).toStrictEqual({
      nodeType: "element",
      nodeName: "p",
    })
  })

  test("an attribute", () => {
    const template = `
    <p data-abc="def"></p>
  `
    const el = parseHandledom(template)
    expect(el.attributes?.length === 1)
    expect(el.attributes![0].name === "data-abc")
    expect(el.attributes![0].value === "def")
  })

  test("2 attributes in a child element", () => {
    const template = `
  <div>
    <p ab="cd" ef="gh"></p>
  </div>
  `
    const el = parseHandledom(template)
    const child = el.children![0] as AstElement
    expect(child.attributes?.length === 2)
    expect(child.attributes![0].name === "ab")
    expect(child.attributes![0].value === "cd")
    expect(child.attributes![1].name === "ef")
    expect(child.attributes![1].value === "gh")
  })

  test("Entity #1 abababa", () => {
    const template = `<p>ab &gt; cd</p>`
    const el = parseHandledom(template)
    expect(el.children![0]).toBe("ab > cd")
  })

  test("Entity #2", () => {
    const template = `<p data-ab="ab &amp; cd"></p>`
    const el = parseHandledom(template)
    expect(el.attributes?.[0].value).toBe("ab & cd")
  })

  test("unknown named entity", () => {
    const template = `
    <div>Some text &aacute;</div>
  `
    expect(() => parseHandledom(template)).toThrow()
  })

  test("Hexadecimal entity", () => {
    const template = `<p>&#x59;ahoo!</p>`
    const el = parseHandledom(template)
    expect(el.children?.[0]).toBe("Yahoo!")
  })

  test("Decimal entity", () => {
    const template = `<p>&#71;oogle...</p>`
    const el = parseHandledom(template)
    expect(el.children?.[0]).toBe("Google...")
  })

  test("ast with vars", () => {
    const template = `
    <div>
      <p class={{ foo }}>{{ bar }}</p>
    </div>
  `
    const ast = parseHandledom(template)
    const p = ast.children?.[0] as AstElement
    expect(p.attributes?.[0]).toStrictEqual({
      name: "class",
      value: {
        nodeType: "variable",
        variableName: "foo"
      }
    })
    expect(p.children?.[0]).toStrictEqual({
      nodeType: "variable",
      variableName: "bar"
    })
  })

  test("ref attribute as variable", () => {
    const template = `
    <div :ref={{ myVar }}></div>
  `
    const ast = parseHandledom(template)
    expect(() => generateCode(ast)).toThrow()
  })
})