// @ts-ignore
import { HandleDomParserListener } from "../../antlr-parser/HandleDomParserListener.js"
import { AstAttribute, AstElement, AstNode, AstVariable } from "../../types/ast"
import { AntlrRuleContext } from "./antlr4-defs"
import { convertEntities } from "./convert-entities"

export default class AstExtractor extends (HandleDomParserListener as any) {
  root?: AstElement
  private stack: AstElement[]
  private currentAttribute?: AstAttribute

  constructor() {
    super()
    this.stack = []
  }

  exitTemplate() {
    if (this.stack.length !== 0)
      throw new Error("Non-empty stack")
  }

  enterElement(ctx: AntlrRuleContext) {
    // console.log("... enterElement", ctx.getText())
    const name = ctx.TAG_NAME().getText().toLowerCase()
    const el: AstElement = {
      nodeType: "element",
      nodeName: name,
    }
    this.registerElement(el)
  }

  exitElement(ctx: AntlrRuleContext) {
    // console.log("... exitElement", ctx.getText())
    const closeTag = ctx.END_TAG_NAME().getText().toLowerCase()
    const el = this.stack.pop()
    if (!el)
      throw new Error("Stack is empty")
    if (el.nodeName !== closeTag)
      throw new Error(`Element <${el.nodeName}> has an invalid closing tag </${closeTag}>`)
  }

  enterHtmlEmptyElement(ctx: AntlrRuleContext) {
    // console.log("... enterHtmlEmptyElement", ctx.getText())
    const name = ctx.EMPTY_TAG_NAME().getText().toLowerCase()
    const el: AstElement = {
      nodeType: "element",
      nodeName: name,
      emptyTag: true
    }
    this.registerElement(el)
  }

  exitHtmlEmptyElement() {
    // console.log("... exitHtmlEmptyElement", ctx.getText())
    this.stack.pop()
  }

  enterAttribute(ctx: AntlrRuleContext) {
    // console.log("... enterAttribute", ctx.getText())
    const attribute: AstAttribute = {
      name: ctx.ATTR_NAME().getText().toLowerCase()
    }
    this.currentAttribute = attribute

    const attrVal = ctx.attributeValue()
    if (attrVal) {
      const rawValue = attrVal.getText().trim()
      if (rawValue[0] !== "{")
        attribute.value = convertEntities(rawValue.substring(1, rawValue.length - 1))
    }

    addAttributeTo(this.getParentElement(), attribute)
  }

  exitAttribute() {
    this.currentAttribute = undefined
  }

  // enterHtmlWhitespace(ctx: AntlrRuleContext) {
  //   const children = this.getParentElement().children
  //   const ws = " "

  //   // We can discard the whitespace at the begin of a tag content.
  //   if (children.length === 0)
  //     return

  //   if (typeof children[children.length - 1] === "string") {
  //     const str = children[children.length - 1] as string
  //     const ch = str.charAt(str.length - 1)

  //     // We reduce consecutive white space to single one.
  //     if (ch !== ws)
  //       children[children.length - 1] += ws
  //   } else {
  //     const n = ctx.parentCtx.getChildCount()
  //     const i = ctx.parentCtx.children.indexOf(ctx)

  //     // We cannot discard the whitespace that is not at the end of tag.
  //     if (i !== n - 1)
  //       children.push(ws)
  //   }
  // }

  enterTextContent(ctx: AntlrRuleContext) {
    // console.log("... enterTextContent", ctx.getText())
    const text = convertEntities(ctx.getText())
    addChildTo(this.getParentElement(), text)
  }

  enterVariable(ctx: AntlrRuleContext) {
    // console.log("... enterVariable", ctx.getText())
    const variableName = ctx.VAR_NAME().getText()
    const variable: AstVariable = {
      nodeType: "variable",
      variableName
    }
    if (this.currentAttribute)
      this.currentAttribute.value = variable
    else
      addChildTo(this.getParentElement(), variable)
  }

  private registerElement(el: AstElement) {
    if (!this.root)
      this.root = el
    if (this.stack.length !== 0)
      addChildTo(this.getParentElement(), el)
    this.stack.push(el)
  }

  private getParentElement(): AstElement {
    const el = this.stack[this.stack.length - 1]
    if (!el)
      throw new Error("Missing parent")
    return el
  }
}

function addChildTo(el: AstElement, child: AstNode) {
  if (!el.children)
    el.children = []
  el.children.push(child)
}

function addAttributeTo(el: AstElement, attr: AstAttribute) {
  if (!el.attributes)
    el.attributes = []
  el.attributes.push(attr)
}