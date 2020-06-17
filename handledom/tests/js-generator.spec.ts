import { compileHandledom } from "../src/api.compiler"

describe("JS Generator Specification", () => {
  test("ref attribute as variable", () => {
    const template = `
    <div h={{ myVar }}></div>
  `
    expect(() => compileHandledom(template)).toThrow()
  })

  test("returns root,refs,ref", () => {
    const code = compileHandledom(`
    <div h="handle1"></div>
  `)
    // console.log(code)
    expect(code.includes("return{root,refs,ref}"))
  })
})