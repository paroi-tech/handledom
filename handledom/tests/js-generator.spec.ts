import { compileHandledom } from "../src/api.compiler"

describe("JS Generator Specification", () => {
  test("ref attribute as variable", () => {
    const template = `
    <div h-ref={{ myVar }}></div>
  `
    expect(() => compileHandledom(template)).toThrow()
  })
})