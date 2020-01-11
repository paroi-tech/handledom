export interface FoundTemplate {
  start: number
  end: number
  code: string
  value: string
}

export function findHandledomTemplateString(source: string): FoundTemplate|undefined {
  const newLine = `(?:\\r?\\n|\\r)`
  const lineBegin = `(?:^|${newLine})`
  const varName = "[a-zA-Z_][a-zA-Z0-9_]*"
  const varDeclar = `(?:const|let|var)\\s${varName}`
  const beforeHandledomTag = `${varDeclar}\\s*=`
  const templateString = "`(?:[^`\\\\]*(?:\\\\.[^`\\\\]*)*)`"

  const reg = new RegExp(
    `${lineBegin}(${beforeHandledomTag}\\s*)(?:handledom)\\s*(${templateString})(?:\\s*;)?`,
    "g"
  )

  const found = reg.exec(source)

  console.log("Found ", found)

  if (!found)
    return

  let start = found.index
  let [code, prefixCode, templateCode] = found

  if (code[0] === "\r" && code[1] === "\n") {
    start += 2
    code = code.substr(2)
  } else if (code[0] === "\n" || code[0] === "\r") {
    ++start
    code = code.substr(1)
  }

  const lastIndex = code.length - 1
  if (code[lastIndex] === ";")
    code = code.substr(0, lastIndex)

  const end = start + code.length

  const handledomTagStart = start + prefixCode.length

  return {
    start: handledomTagStart,
    end,
    code,
    // tslint:disable-next-line: no-eval
    value: eval(templateCode)
  }
}
