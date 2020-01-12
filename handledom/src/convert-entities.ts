const namedEntities = {
  "&amp;": "&",
  "&gt;": ">",
  "&lt;": "<",
  "&quot;": "\"",
  "&nbsp;": "\0xa0",
}

export function convertEntities(text: string): string {
  return text.replace(/&#?[a-z0-9]{2,8};/ig, (match) => {
    const lower = match.toLowerCase()
    if (lower[1] === "#") {
      return lower[2] === "x" ? hexEntityToChar(lower) : decimalEntityToChar(lower)
    } else {
      if (!namedEntities[lower]) {
        const listStr = Object.keys(namedEntities).join(", ")
        throw new Error(`${lower} is not a supported named entity. Supported are: ${listStr}.`)
      }
      return namedEntities[lower]
    }
  })
}

function hexEntityToChar(hexRef: string) {
  const codepoint = parseInt(hexRef.substring(3, hexRef.length - 1), 16)
  return String.fromCodePoint(codepoint)
}

function decimalEntityToChar(decRef: string) {
  const codepoint = parseInt(decRef.substring(2, decRef.length - 1), 10)
  return String.fromCodePoint(codepoint)
}
