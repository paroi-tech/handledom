import { parseHandledom } from "../src/api.compiler"
import { toGeneratedVariables } from "../src/js-generator/generated-variables"

describe("Generated Variables Specification", () => {
  test("Generate 2 variables", () => {
    const template = `
<div>
  <p></p>
</div>
`
    const ast = parseHandledom(template)
    const genVariables = toGeneratedVariables(ast)
    expect(genVariables.length).toBe(2)
    expect(genVariables[0].varName).toBe("root")
    expect(genVariables[0].parentVarName).toBeUndefined()
    expect(genVariables[0].scope).toBeUndefined()
    expect(genVariables[1].parentVarName).toBe("root")
    expect(genVariables[1].scope).toBeUndefined()
  })

  test("With Scope without insertBefore", () => {
    const template = `
<div>
  <p h-show={{ ab }}>
    <i></i>
  </p>
</div>
`
    const ast = parseHandledom(template)
    const genVariables = toGeneratedVariables(ast)
    // console.log("genVariables", genVariables)
    // expect(genVariables.length).toBe(2) // FIXME
    expect(genVariables[0].varName).toBe("root")
    expect(genVariables[0].scope).toBeUndefined()
    expect(genVariables[1].scope).toBeDefined()
    const { children, insertBefore } = genVariables[1].scope!
    // expect(children.length).toBe(1) // FIXME
    expect(insertBefore.length).toBe(0)
  })

  test("With Scope #2", () => {
    const template = `
<div>
  <p h-show={{ ab }}>
    <i></i>
  </p>
  <br>
</div>
`
    const ast = parseHandledom(template)
    const genVariables = toGeneratedVariables(ast)
    // expect(genVariables.length).toBe(3) // FIXME
    expect(genVariables[0].scope).toBeUndefined()
    expect(genVariables[1].scope).toBeDefined()
    // const { children, insertBefore } = genVariables[1].scope! // FIXME
    // expect(children.length).toBe(1)
    // expect(insertBefore.length).toBe(1)
    // expect(insertBefore[0]).toBe(genVariables[2])
  })
})