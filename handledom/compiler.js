'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var antlr4 = require('antlr4');
var antlr4$1 = _interopDefault(require('antlr4/index'));

const encodeString = JSON.stringify;
function generateCode(root) {
    const a = bfs(root);
    const refs = {};
    let updateMethod = false;
    let fnBody = ``;
    for (const info of a) {
        const { varName, parentVarName, node } = info;
        if (typeof node === "string") {
            fnBody += `const ${varName}=document.createTextNode(${encodeString(node)});`;
            fnBody += `${parentVarName}.appendChild(${varName});`;
        }
        else if (node.nodeType === "variable") {
            updateMethod = true;
            fnBody += `const ${varName}=document.createTextNode(variables["${node.variableName}"] || "");`;
            fnBody += `${parentVarName}.appendChild(${varName});`;
            fnBody += `getCbArray("${node.variableName}").push((v) => ${varName}.nodeValue = v);`;
        }
        else {
            fnBody += `const ${varName}=document.createElement(${encodeString(node.nodeName)});`;
            if (parentVarName)
                fnBody += `${parentVarName}.appendChild(${varName});`;
            const chunks = [];
            for (const attr of (node.attributes || [])) {
                if (attr.name === ":ref") {
                    checkRefAttributeValue(attr.value, node.nodeName);
                    updateRefs(refs, varName, attr.value);
                }
                else if (!attr.value || typeof attr.value === "string") {
                    const p1 = encodeString(attr.name);
                    const p2 = encodeString(attr.value || "");
                    chunks.push(`${varName}.setAttribute(${p1}, ${p2});`);
                }
                else {
                    const property = attr.value.variableName;
                    const cond = `"${property}" in variables`;
                    const statement = `${varName}.setAttribute(${encodeString(attr.name)}, variables["${property}"]);`;
                    chunks.push(`if(${cond}){${statement}}`);
                    chunks.push(`getCbArray("${property}").push(v => ${varName}.setAttribute(${encodeString(attr.name)}, v));`);
                    updateMethod = true;
                }
            }
            if (chunks.length !== 0)
                fnBody += chunks.join("");
        }
    }
    const refsCode = "{" + Object.entries(refs).map(([k, v]) => `${k}:${Array.isArray(v) ? `[${v.join(",")}]` : v}`).join(",") + "};";
    fnBody += `const refs=${refsCode};`;
    let fnHead = `function(${updateMethod ? "variables" : ""}){`;
    if (updateMethod) {
        fnHead += /* */ `const m=new Map();`;
        fnHead += /* */ `const getCbArray=(key)=>{`;
        fnHead += /*   */ `let value=m.get(key);`;
        fnHead += /*   */ `if (!value){`;
        fnHead += /*     */ `value=[];`;
        fnHead += /*     */ `m.set(key,value);`;
        fnHead += /*   */ `}`;
        fnHead += /*   */ `return value;`;
        fnHead += /* */ `};`;
        fnBody += /* */ `const update=values=>{`;
        fnBody += /*   */ `Object.entries(values).forEach(([k,v])=>{`;
        fnBody += /*     */ `const cbArray=m.get(k);`;
        fnBody += /*     */ `if(cbArray)`;
        fnBody += /*       */ `cbArray.forEach(cb=>cb(v));`;
        fnBody += /*   */ `})`;
        fnBody += /* */ `};`;
        fnBody += `return{root:el1,refs,update};`;
    }
    else
        fnBody += `return{root:el1,refs};`;
    fnBody += `}`;
    return `${fnHead}${fnBody} // eslint-disable-line tslint:disable-line`;
}
function updateRefs(refs, varName, ref) {
    const obj = refs[ref];
    if (!obj)
        refs[ref] = varName;
    else if (Array.isArray(obj))
        obj.push(varName);
    else
        refs[ref] = [obj, varName];
}
function bfs(root) {
    var _a;
    const q = [];
    const a = [];
    let j = 1;
    q.push({
        varName: `el${j}`,
        node: root
    });
    j += 1;
    while (q.length !== 0) {
        const current = q.shift();
        const node = current.node;
        if (typeof node !== "string" && node.nodeType === "element") {
            for (const child of (node.children || [])) {
                q.push({
                    varName: `el${j}`,
                    node: child,
                    parentVarName: (_a = current) === null || _a === void 0 ? void 0 : _a.varName
                });
                j += 1;
            }
        }
        a.push(current);
    }
    return a;
}
function checkRefAttributeValue(value, tagName) {
    if (!value)
        throw new Error(`Missing value for :ref attribute on ${tagName} tag`);
    if (typeof value !== "string")
        throw new Error(`:ref attribute cannot be a variable`);
    if (!/^[a-zA-z_$][\w$]*$/.test(value))
        throw new Error(`Invalid :ref attribute value: ${value}`);
}

// Generated from HandleDomLexer.g4 by ANTLR 4.7.2
// jshint ignore: start




var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u0018\u010b\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\u0004\u0002",
    "\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t\u0004\u0004\u0005\t\u0005",
    "\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004\b\t\b\u0004\t\t\t\u0004",
    "\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e",
    "\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004\u0011\t\u0011\u0004\u0012",
    "\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t\u0014\u0004\u0015\t\u0015",
    "\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0007\u0002:\n\u0002\f\u0002",
    "\u000e\u0002=\u000b\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0005\u0003G",
    "\n\u0003\u0003\u0003\u0006\u0003J\n\u0003\r\u0003\u000e\u0003K\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0006\u0007_",
    "\n\u0007\r\u0007\u000e\u0007`\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0003\b\u0003\b\u0003\b\u0003\b\u0003\b\u0005\b\u009a\n\b\u0003\b",
    "\u0003\b\u0003\b\u0003\t\u0003\t\u0007\t\u00a1\n\t\f\t\u000e\t\u00a4",
    "\u000b\t\u0003\t\u0003\t\u0003\t\u0003\n\u0003\n\u0003\n\u0003\n\u0003",
    "\n\u0003\n\u0007\n\u00af\n\n\f\n\u000e\n\u00b2\u000b\n\u0003\n\u0003",
    "\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0005\u000b",
    "\u00bc\n\u000b\u0003\u000b\u0006\u000b\u00bf\n\u000b\r\u000b\u000e\u000b",
    "\u00c0\u0003\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r\u0003",
    "\r\u0003\r\u0003\u000e\u0003\u000e\u0007\u000e\u00ce\n\u000e\f\u000e",
    "\u000e\u000e\u00d1\u000b\u000e\u0003\u000f\u0003\u000f\u0003\u0010\u0003",
    "\u0010\u0007\u0010\u00d7\n\u0010\f\u0010\u000e\u0010\u00da\u000b\u0010",
    "\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0007\u0011\u00e0\n",
    "\u0011\f\u0011\u000e\u0011\u00e3\u000b\u0011\u0003\u0011\u0003\u0011",
    "\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0013",
    "\u0003\u0013\u0007\u0013\u00ee\n\u0013\f\u0013\u000e\u0013\u00f1\u000b",
    "\u0013\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0015\u0003",
    "\u0015\u0005\u0015\u00f9\n\u0015\u0003\u0015\u0006\u0015\u00fc\n\u0015",
    "\r\u0015\u000e\u0015\u00fd\u0003\u0016\u0003\u0016\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0017\u0003\u0017\u0007\u0017\u0107\n\u0017",
    "\f\u0017\u000e\u0017\u010a\u000b\u0017\u0004;\u00b0\u0002\u0018\u0007",
    "\u0003\t\u0004\u000b\u0005\r\u0006\u000f\u0007\u0011\b\u0013\t\u0015",
    "\n\u0017\u000b\u0019\f\u001b\r\u001d\u000e\u001f\u000f!\u0010#\u0011",
    "%\u0012\'\u0013)\u0014+\u0015-\u0016/\u00171\u0018\u0007\u0002\u0003",
    "\u0004\u0005\u0006\u001f\u0004\u0002\u000b\u000b\"\"\u0004\u0002>>}",
    "}\u0004\u0002CCcc\u0004\u0002TTtt\u0004\u0002GGgg\u0004\u0002DDdd\u0004",
    "\u0002UUuu\u0004\u0002EEee\u0004\u0002QQqq\u0004\u0002NNnn\u0004\u0002",
    "OOoo\u0004\u0002FFff\u0004\u0002JJjj\u0004\u0002KKkk\u0004\u0002IIi",
    "i\u0004\u0002PPpp\u0004\u0002RRrr\u0004\u0002WWww\u0004\u0002VVvv\u0004",
    "\u0002MMmm\u0004\u0002YYyy\u0004\u0002C\\c|\u0007\u0002//2;C\\aac|\u0005",
    "\u0002<<C\\c|\b\u0002&&//2<C\\aac|\u0003\u0002$$\u0003\u0002))\u0006",
    "\u0002&&C\\aac|\u0007\u0002&&2;C\\aac|\u0002\u0126\u0002\u0007\u0003",
    "\u0002\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003",
    "\u0002\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003",
    "\u0002\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0003\u0013\u0003",
    "\u0002\u0002\u0002\u0003\u0015\u0003\u0002\u0002\u0002\u0004\u0017\u0003",
    "\u0002\u0002\u0002\u0004\u0019\u0003\u0002\u0002\u0002\u0004\u001b\u0003",
    "\u0002\u0002\u0002\u0004\u001d\u0003\u0002\u0002\u0002\u0004\u001f\u0003",
    "\u0002\u0002\u0002\u0004!\u0003\u0002\u0002\u0002\u0004#\u0003\u0002",
    "\u0002\u0002\u0004%\u0003\u0002\u0002\u0002\u0004\'\u0003\u0002\u0002",
    "\u0002\u0005)\u0003\u0002\u0002\u0002\u0005+\u0003\u0002\u0002\u0002",
    "\u0006-\u0003\u0002\u0002\u0002\u0006/\u0003\u0002\u0002\u0002\u0006",
    "1\u0003\u0002\u0002\u0002\u00073\u0003\u0002\u0002\u0002\tI\u0003\u0002",
    "\u0002\u0002\u000bM\u0003\u0002\u0002\u0002\rR\u0003\u0002\u0002\u0002",
    "\u000fV\u0003\u0002\u0002\u0002\u0011^\u0003\u0002\u0002\u0002\u0013",
    "\u0099\u0003\u0002\u0002\u0002\u0015\u009e\u0003\u0002\u0002\u0002\u0017",
    "\u00a8\u0003\u0002\u0002\u0002\u0019\u00be\u0003\u0002\u0002\u0002\u001b",
    "\u00c2\u0003\u0002\u0002\u0002\u001d\u00c6\u0003\u0002\u0002\u0002\u001f",
    "\u00cb\u0003\u0002\u0002\u0002!\u00d2\u0003\u0002\u0002\u0002#\u00d4",
    "\u0003\u0002\u0002\u0002%\u00dd\u0003\u0002\u0002\u0002\'\u00e6\u0003",
    "\u0002\u0002\u0002)\u00eb\u0003\u0002\u0002\u0002+\u00f2\u0003\u0002",
    "\u0002\u0002-\u00fb\u0003\u0002\u0002\u0002/\u00ff\u0003\u0002\u0002",
    "\u00021\u0104\u0003\u0002\u0002\u000234\u0007>\u0002\u000245\u0007#",
    "\u0002\u000256\u0007/\u0002\u000267\u0007/\u0002\u00027;\u0003\u0002",
    "\u0002\u00028:\u000b\u0002\u0002\u000298\u0003\u0002\u0002\u0002:=\u0003",
    "\u0002\u0002\u0002;<\u0003\u0002\u0002\u0002;9\u0003\u0002\u0002\u0002",
    "<>\u0003\u0002\u0002\u0002=;\u0003\u0002\u0002\u0002>?\u0007/\u0002",
    "\u0002?@\u0007/\u0002\u0002@A\u0007@\u0002\u0002AB\u0003\u0002\u0002",
    "\u0002BC\b\u0002\u0002\u0002C\b\u0003\u0002\u0002\u0002DJ\t\u0002\u0002",
    "\u0002EG\u0007\u000f\u0002\u0002FE\u0003\u0002\u0002\u0002FG\u0003\u0002",
    "\u0002\u0002GH\u0003\u0002\u0002\u0002HJ\u0007\f\u0002\u0002ID\u0003",
    "\u0002\u0002\u0002IF\u0003\u0002\u0002\u0002JK\u0003\u0002\u0002\u0002",
    "KI\u0003\u0002\u0002\u0002KL\u0003\u0002\u0002\u0002L\n\u0003\u0002",
    "\u0002\u0002MN\u0007}\u0002\u0002NO\u0007}\u0002\u0002OP\u0003\u0002",
    "\u0002\u0002PQ\b\u0004\u0003\u0002Q\f\u0003\u0002\u0002\u0002RS\u0007",
    ">\u0002\u0002ST\u0003\u0002\u0002\u0002TU\b\u0005\u0004\u0002U\u000e",
    "\u0003\u0002\u0002\u0002VW\u0007>\u0002\u0002WX\u00071\u0002\u0002X",
    "Y\u0003\u0002\u0002\u0002YZ\b\u0006\u0005\u0002Z\u0010\u0003\u0002\u0002",
    "\u0002[_\n\u0003\u0002\u0002\\]\u0007}\u0002\u0002]_\n\u0003\u0002\u0002",
    "^[\u0003\u0002\u0002\u0002^\\\u0003\u0002\u0002\u0002_`\u0003\u0002",
    "\u0002\u0002`^\u0003\u0002\u0002\u0002`a\u0003\u0002\u0002\u0002a\u0012",
    "\u0003\u0002\u0002\u0002bc\t\u0004\u0002\u0002cd\t\u0005\u0002\u0002",
    "de\t\u0006\u0002\u0002e\u009a\t\u0004\u0002\u0002fg\t\u0007\u0002\u0002",
    "gh\t\u0004\u0002\u0002hi\t\b\u0002\u0002i\u009a\t\u0006\u0002\u0002",
    "jk\t\u0007\u0002\u0002k\u009a\t\u0005\u0002\u0002lm\t\t\u0002\u0002",
    "mn\t\n\u0002\u0002n\u009a\t\u000b\u0002\u0002op\t\u0006\u0002\u0002",
    "pq\t\f\u0002\u0002qr\t\u0007\u0002\u0002rs\t\u0006\u0002\u0002s\u009a",
    "\t\r\u0002\u0002tu\t\u000e\u0002\u0002u\u009a\t\u0005\u0002\u0002vw",
    "\t\u000f\u0002\u0002wx\t\f\u0002\u0002x\u009a\t\u0010\u0002\u0002yz",
    "\t\u000f\u0002\u0002z{\t\u0011\u0002\u0002{|\t\u0012\u0002\u0002|}\t",
    "\u0013\u0002\u0002}\u009a\t\u0014\u0002\u0002~\u007f\t\u000b\u0002\u0002",
    "\u007f\u0080\t\u000f\u0002\u0002\u0080\u0081\t\u0011\u0002\u0002\u0081",
    "\u009a\t\u0015\u0002\u0002\u0082\u0083\t\f\u0002\u0002\u0083\u0084\t",
    "\u0006\u0002\u0002\u0084\u0085\t\u0014\u0002\u0002\u0085\u009a\t\u0004",
    "\u0002\u0002\u0086\u0087\t\u0012\u0002\u0002\u0087\u0088\t\u0004\u0002",
    "\u0002\u0088\u0089\t\u0005\u0002\u0002\u0089\u008a\t\u0004\u0002\u0002",
    "\u008a\u009a\t\f\u0002\u0002\u008b\u008c\t\b\u0002\u0002\u008c\u008d",
    "\t\n\u0002\u0002\u008d\u008e\t\u0013\u0002\u0002\u008e\u008f\t\u0005",
    "\u0002\u0002\u008f\u0090\t\t\u0002\u0002\u0090\u009a\t\u0006\u0002\u0002",
    "\u0091\u0092\t\u0014\u0002\u0002\u0092\u0093\t\u0005\u0002\u0002\u0093",
    "\u0094\t\u0004\u0002\u0002\u0094\u0095\t\t\u0002\u0002\u0095\u009a\t",
    "\u0015\u0002\u0002\u0096\u0097\t\u0016\u0002\u0002\u0097\u0098\t\u0007",
    "\u0002\u0002\u0098\u009a\t\u0005\u0002\u0002\u0099b\u0003\u0002\u0002",
    "\u0002\u0099f\u0003\u0002\u0002\u0002\u0099j\u0003\u0002\u0002\u0002",
    "\u0099l\u0003\u0002\u0002\u0002\u0099o\u0003\u0002\u0002\u0002\u0099",
    "t\u0003\u0002\u0002\u0002\u0099v\u0003\u0002\u0002\u0002\u0099y\u0003",
    "\u0002\u0002\u0002\u0099~\u0003\u0002\u0002\u0002\u0099\u0082\u0003",
    "\u0002\u0002\u0002\u0099\u0086\u0003\u0002\u0002\u0002\u0099\u008b\u0003",
    "\u0002\u0002\u0002\u0099\u0091\u0003\u0002\u0002\u0002\u0099\u0096\u0003",
    "\u0002\u0002\u0002\u009a\u009b\u0003\u0002\u0002\u0002\u009b\u009c\b",
    "\b\u0006\u0002\u009c\u009d\b\b\u0007\u0002\u009d\u0014\u0003\u0002\u0002",
    "\u0002\u009e\u00a2\t\u0017\u0002\u0002\u009f\u00a1\t\u0018\u0002\u0002",
    "\u00a0\u009f\u0003\u0002\u0002\u0002\u00a1\u00a4\u0003\u0002\u0002\u0002",
    "\u00a2\u00a0\u0003\u0002\u0002\u0002\u00a2\u00a3\u0003\u0002\u0002\u0002",
    "\u00a3\u00a5\u0003\u0002\u0002\u0002\u00a4\u00a2\u0003\u0002\u0002\u0002",
    "\u00a5\u00a6\b\t\u0006\u0002\u00a6\u00a7\b\t\u0007\u0002\u00a7\u0016",
    "\u0003\u0002\u0002\u0002\u00a8\u00a9\u0007>\u0002\u0002\u00a9\u00aa",
    "\u0007#\u0002\u0002\u00aa\u00ab\u0007/\u0002\u0002\u00ab\u00ac\u0007",
    "/\u0002\u0002\u00ac\u00b0\u0003\u0002\u0002\u0002\u00ad\u00af\u000b",
    "\u0002\u0002\u0002\u00ae\u00ad\u0003\u0002\u0002\u0002\u00af\u00b2\u0003",
    "\u0002\u0002\u0002\u00b0\u00b1\u0003\u0002\u0002\u0002\u00b0\u00ae\u0003",
    "\u0002\u0002\u0002\u00b1\u00b3\u0003\u0002\u0002\u0002\u00b2\u00b0\u0003",
    "\u0002\u0002\u0002\u00b3\u00b4\u0007/\u0002\u0002\u00b4\u00b5\u0007",
    "/\u0002\u0002\u00b5\u00b6\u0007@\u0002\u0002\u00b6\u00b7\u0003\u0002",
    "\u0002\u0002\u00b7\u00b8\b\n\u0002\u0002\u00b8\u0018\u0003\u0002\u0002",
    "\u0002\u00b9\u00bf\t\u0002\u0002\u0002\u00ba\u00bc\u0007\u000f\u0002",
    "\u0002\u00bb\u00ba\u0003\u0002\u0002\u0002\u00bb\u00bc\u0003\u0002\u0002",
    "\u0002\u00bc\u00bd\u0003\u0002\u0002\u0002\u00bd\u00bf\u0007\f\u0002",
    "\u0002\u00be\u00b9\u0003\u0002\u0002\u0002\u00be\u00bb\u0003\u0002\u0002",
    "\u0002\u00bf\u00c0\u0003\u0002\u0002\u0002\u00c0\u00be\u0003\u0002\u0002",
    "\u0002\u00c0\u00c1\u0003\u0002\u0002\u0002\u00c1\u001a\u0003\u0002\u0002",
    "\u0002\u00c2\u00c3\u0007@\u0002\u0002\u00c3\u00c4\u0003\u0002\u0002",
    "\u0002\u00c4\u00c5\b\f\u0006\u0002\u00c5\u001c\u0003\u0002\u0002\u0002",
    "\u00c6\u00c7\u00071\u0002\u0002\u00c7\u00c8\u0007@\u0002\u0002\u00c8",
    "\u00c9\u0003\u0002\u0002\u0002\u00c9\u00ca\b\r\u0006\u0002\u00ca\u001e",
    "\u0003\u0002\u0002\u0002\u00cb\u00cf\t\u0019\u0002\u0002\u00cc\u00ce",
    "\t\u001a\u0002\u0002\u00cd\u00cc\u0003\u0002\u0002\u0002\u00ce\u00d1",
    "\u0003\u0002\u0002\u0002\u00cf\u00cd\u0003\u0002\u0002\u0002\u00cf\u00d0",
    "\u0003\u0002\u0002\u0002\u00d0 \u0003\u0002\u0002\u0002\u00d1\u00cf",
    "\u0003\u0002\u0002\u0002\u00d2\u00d3\u0007?\u0002\u0002\u00d3\"\u0003",
    "\u0002\u0002\u0002\u00d4\u00d8\u0007$\u0002\u0002\u00d5\u00d7\n\u001b",
    "\u0002\u0002\u00d6\u00d5\u0003\u0002\u0002\u0002\u00d7\u00da\u0003\u0002",
    "\u0002\u0002\u00d8\u00d6\u0003\u0002\u0002\u0002\u00d8\u00d9\u0003\u0002",
    "\u0002\u0002\u00d9\u00db\u0003\u0002\u0002\u0002\u00da\u00d8\u0003\u0002",
    "\u0002\u0002\u00db\u00dc\u0007$\u0002\u0002\u00dc$\u0003\u0002\u0002",
    "\u0002\u00dd\u00e1\u0007)\u0002\u0002\u00de\u00e0\n\u001c\u0002\u0002",
    "\u00df\u00de\u0003\u0002\u0002\u0002\u00e0\u00e3\u0003\u0002\u0002\u0002",
    "\u00e1\u00df\u0003\u0002\u0002\u0002\u00e1\u00e2\u0003\u0002\u0002\u0002",
    "\u00e2\u00e4\u0003\u0002\u0002\u0002\u00e3\u00e1\u0003\u0002\u0002\u0002",
    "\u00e4\u00e5\u0007)\u0002\u0002\u00e5&\u0003\u0002\u0002\u0002\u00e6",
    "\u00e7\u0007}\u0002\u0002\u00e7\u00e8\u0007}\u0002\u0002\u00e8\u00e9",
    "\u0003\u0002\u0002\u0002\u00e9\u00ea\b\u0012\u0003\u0002\u00ea(\u0003",
    "\u0002\u0002\u0002\u00eb\u00ef\t\u0017\u0002\u0002\u00ec\u00ee\t\u0018",
    "\u0002\u0002\u00ed\u00ec\u0003\u0002\u0002\u0002\u00ee\u00f1\u0003\u0002",
    "\u0002\u0002\u00ef\u00ed\u0003\u0002\u0002\u0002\u00ef\u00f0\u0003\u0002",
    "\u0002\u0002\u00f0*\u0003\u0002\u0002\u0002\u00f1\u00ef\u0003\u0002",
    "\u0002\u0002\u00f2\u00f3\u0007@\u0002\u0002\u00f3\u00f4\u0003\u0002",
    "\u0002\u0002\u00f4\u00f5\b\u0014\u0006\u0002\u00f5,\u0003\u0002\u0002",
    "\u0002\u00f6\u00fc\t\u0002\u0002\u0002\u00f7\u00f9\u0007\u000f\u0002",
    "\u0002\u00f8\u00f7\u0003\u0002\u0002\u0002\u00f8\u00f9\u0003\u0002\u0002",
    "\u0002\u00f9\u00fa\u0003\u0002\u0002\u0002\u00fa\u00fc\u0007\f\u0002",
    "\u0002\u00fb\u00f6\u0003\u0002\u0002\u0002\u00fb\u00f8\u0003\u0002\u0002",
    "\u0002\u00fc\u00fd\u0003\u0002\u0002\u0002\u00fd\u00fb\u0003\u0002\u0002",
    "\u0002\u00fd\u00fe\u0003\u0002\u0002\u0002\u00fe.\u0003\u0002\u0002",
    "\u0002\u00ff\u0100\u0007\u007f\u0002\u0002\u0100\u0101\u0007\u007f\u0002",
    "\u0002\u0101\u0102\u0003\u0002\u0002\u0002\u0102\u0103\b\u0016\u0006",
    "\u0002\u01030\u0003\u0002\u0002\u0002\u0104\u0108\t\u001d\u0002\u0002",
    "\u0105\u0107\t\u001e\u0002\u0002\u0106\u0105\u0003\u0002\u0002\u0002",
    "\u0107\u010a\u0003\u0002\u0002\u0002\u0108\u0106\u0003\u0002\u0002\u0002",
    "\u0108\u0109\u0003\u0002\u0002\u0002\u01092\u0003\u0002\u0002\u0002",
    "\u010a\u0108\u0003\u0002\u0002\u0002\u001b\u0002\u0003\u0004\u0005\u0006",
    ";FIK^`\u0099\u00a2\u00b0\u00bb\u00be\u00c0\u00cf\u00d8\u00e1\u00ef\u00f8",
    "\u00fb\u00fd\u0108\b\b\u0002\u0002\u0007\u0006\u0002\u0007\u0003\u0002",
    "\u0007\u0005\u0002\u0006\u0002\u0002\u0007\u0004\u0002"].join("");


var atn = new antlr4$1.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4$1.dfa.DFA(ds, index); });

function HandleDomLexer(input) {
	antlr4$1.Lexer.call(this, input);
    this._interp = new antlr4$1.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4$1.PredictionContextCache());
    return this;
}

HandleDomLexer.prototype = Object.create(antlr4$1.Lexer.prototype);
HandleDomLexer.prototype.constructor = HandleDomLexer;

Object.defineProperty(HandleDomLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

HandleDomLexer.EOF = antlr4$1.Token.EOF;
HandleDomLexer.HTML_COMMENT = 1;
HandleDomLexer.WS = 2;
HandleDomLexer.VAR_OPEN = 3;
HandleDomLexer.TAG_OPEN = 4;
HandleDomLexer.END_TAG_OPEN = 5;
HandleDomLexer.TEXT_CONTENT = 6;
HandleDomLexer.EMPTY_TAG_NAME = 7;
HandleDomLexer.TAG_NAME = 8;
HandleDomLexer.TAG_HTML_COMMENT = 9;
HandleDomLexer.TAG_WS = 10;
HandleDomLexer.TAG_CLOSE = 11;
HandleDomLexer.TAG_SLASH_CLOSE = 12;
HandleDomLexer.ATTR_NAME = 13;
HandleDomLexer.ATTR_EQ = 14;
HandleDomLexer.ATTR_STRING = 15;
HandleDomLexer.ATTR_STRING_SINGLE_QUOTE = 16;
HandleDomLexer.TAG_VAR_OPEN = 17;
HandleDomLexer.END_TAG_NAME = 18;
HandleDomLexer.END_TAG_CLOSE = 19;
HandleDomLexer.VAR_WS = 20;
HandleDomLexer.VAR_CLOSE = 21;
HandleDomLexer.VAR_NAME = 22;

HandleDomLexer.TAG_BEGIN = 1;
HandleDomLexer.TAG = 2;
HandleDomLexer.END_TAG_BEGIN = 3;
HandleDomLexer.VAR = 4;

HandleDomLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

HandleDomLexer.prototype.modeNames = [ "DEFAULT_MODE", "TAG_BEGIN", "TAG", 
                                       "END_TAG_BEGIN", "VAR" ];

HandleDomLexer.prototype.literalNames = [ null, null, null, null, "'<'", 
                                          "'</'", null, null, null, null, 
                                          null, null, "'/>'", null, "'='", 
                                          null, null, null, null, null, 
                                          null, "'}}'" ];

HandleDomLexer.prototype.symbolicNames = [ null, "HTML_COMMENT", "WS", "VAR_OPEN", 
                                           "TAG_OPEN", "END_TAG_OPEN", "TEXT_CONTENT", 
                                           "EMPTY_TAG_NAME", "TAG_NAME", 
                                           "TAG_HTML_COMMENT", "TAG_WS", 
                                           "TAG_CLOSE", "TAG_SLASH_CLOSE", 
                                           "ATTR_NAME", "ATTR_EQ", "ATTR_STRING", 
                                           "ATTR_STRING_SINGLE_QUOTE", "TAG_VAR_OPEN", 
                                           "END_TAG_NAME", "END_TAG_CLOSE", 
                                           "VAR_WS", "VAR_CLOSE", "VAR_NAME" ];

HandleDomLexer.prototype.ruleNames = [ "HTML_COMMENT", "WS", "VAR_OPEN", 
                                       "TAG_OPEN", "END_TAG_OPEN", "TEXT_CONTENT", 
                                       "EMPTY_TAG_NAME", "TAG_NAME", "TAG_HTML_COMMENT", 
                                       "TAG_WS", "TAG_CLOSE", "TAG_SLASH_CLOSE", 
                                       "ATTR_NAME", "ATTR_EQ", "ATTR_STRING", 
                                       "ATTR_STRING_SINGLE_QUOTE", "TAG_VAR_OPEN", 
                                       "END_TAG_NAME", "END_TAG_CLOSE", 
                                       "VAR_WS", "VAR_CLOSE", "VAR_NAME" ];

HandleDomLexer.prototype.grammarFileName = "HandleDomLexer.g4";



var HandleDomLexer_2 = HandleDomLexer;

// Generated from HandleDomParser.g4 by ANTLR 4.7.2
// jshint ignore: start


// This class defines a complete listener for a parse tree produced by HandleDomParser.
function HandleDomParserListener() {
	antlr4$1.tree.ParseTreeListener.call(this);
	return this;
}

HandleDomParserListener.prototype = Object.create(antlr4$1.tree.ParseTreeListener.prototype);
HandleDomParserListener.prototype.constructor = HandleDomParserListener;

// Enter a parse tree produced by HandleDomParser#template.
HandleDomParserListener.prototype.enterTemplate = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#template.
HandleDomParserListener.prototype.exitTemplate = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#element.
HandleDomParserListener.prototype.enterElement = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#element.
HandleDomParserListener.prototype.exitElement = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#htmlEmptyElement.
HandleDomParserListener.prototype.enterHtmlEmptyElement = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#htmlEmptyElement.
HandleDomParserListener.prototype.exitHtmlEmptyElement = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#content.
HandleDomParserListener.prototype.enterContent = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#content.
HandleDomParserListener.prototype.exitContent = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#contentUnit.
HandleDomParserListener.prototype.enterContentUnit = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#contentUnit.
HandleDomParserListener.prototype.exitContentUnit = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#attributes.
HandleDomParserListener.prototype.enterAttributes = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#attributes.
HandleDomParserListener.prototype.exitAttributes = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#attribute.
HandleDomParserListener.prototype.enterAttribute = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#attribute.
HandleDomParserListener.prototype.exitAttribute = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#attributeValue.
HandleDomParserListener.prototype.enterAttributeValue = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#attributeValue.
HandleDomParserListener.prototype.exitAttributeValue = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#variable.
HandleDomParserListener.prototype.enterVariable = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#variable.
HandleDomParserListener.prototype.exitVariable = function(ctx) {
};


// Enter a parse tree produced by HandleDomParser#textContent.
HandleDomParserListener.prototype.enterTextContent = function(ctx) {
};

// Exit a parse tree produced by HandleDomParser#textContent.
HandleDomParserListener.prototype.exitTextContent = function(ctx) {
};



var HandleDomParserListener_2 = HandleDomParserListener;

var HandleDomParserListener_1 = {
	HandleDomParserListener: HandleDomParserListener_2
};

// Generated from HandleDomParser.g4 by ANTLR 4.7.2
// jshint ignore: start

var HandleDomParserListener$1 = HandleDomParserListener_1.HandleDomParserListener;


var serializedATN$1 = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u0018\u008f\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0003\u0002",
    "\u0007\u0002\u0018\n\u0002\f\u0002\u000e\u0002\u001b\u000b\u0002\u0003",
    "\u0002\u0003\u0002\u0005\u0002\u001f\n\u0002\u0003\u0002\u0007\u0002",
    "\"\n\u0002\f\u0002\u000e\u0002%\u000b\u0002\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003",
    ".\n\u0003\f\u0003\u000e\u00031\u000b\u0003\u0003\u0003\u0005\u00034",
    "\n\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0007\u0005A\n\u0005\f\u0005\u000e\u0005D\u000b\u0005\u0003\u0005\u0003",
    "\u0005\u0007\u0005H\n\u0005\f\u0005\u000e\u0005K\u000b\u0005\u0007\u0005",
    "M\n\u0005\f\u0005\u000e\u0005P\u000b\u0005\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0005\u0006V\n\u0006\u0003\u0007\u0007\u0007Y\n\u0007",
    "\f\u0007\u000e\u0007\\\u000b\u0007\u0003\u0007\u0003\u0007\u0006\u0007",
    "`\n\u0007\r\u0007\u000e\u0007a\u0003\u0007\u0007\u0007e\n\u0007\f\u0007",
    "\u000e\u0007h\u000b\u0007\u0003\u0007\u0007\u0007k\n\u0007\f\u0007\u000e",
    "\u0007n\u000b\u0007\u0005\u0007p\n\u0007\u0003\b\u0003\b\u0003\b\u0003",
    "\b\u0005\bv\n\b\u0003\t\u0003\t\u0003\t\u0005\t{\n\t\u0003\n\u0003\n",
    "\u0007\n\u007f\n\n\f\n\u000e\n\u0082\u000b\n\u0003\n\u0003\n\u0007\n",
    "\u0086\n\n\f\n\u000e\n\u0089\u000b\n\u0003\n\u0003\n\u0003\u000b\u0003",
    "\u000b\u0003\u000b\u0002\u0002\f\u0002\u0004\u0006\b\n\f\u000e\u0010",
    "\u0012\u0014\u0002\u0004\u0003\u0002\r\u000e\u0004\u0002\u0005\u0005",
    "\u0013\u0013\u0002\u0099\u0002\u0019\u0003\u0002\u0002\u0002\u0004(",
    "\u0003\u0002\u0002\u0002\u00069\u0003\u0002\u0002\u0002\b>\u0003\u0002",
    "\u0002\u0002\nU\u0003\u0002\u0002\u0002\fZ\u0003\u0002\u0002\u0002\u000e",
    "u\u0003\u0002\u0002\u0002\u0010z\u0003\u0002\u0002\u0002\u0012|\u0003",
    "\u0002\u0002\u0002\u0014\u008c\u0003\u0002\u0002\u0002\u0016\u0018\u0007",
    "\u0004\u0002\u0002\u0017\u0016\u0003\u0002\u0002\u0002\u0018\u001b\u0003",
    "\u0002\u0002\u0002\u0019\u0017\u0003\u0002\u0002\u0002\u0019\u001a\u0003",
    "\u0002\u0002\u0002\u001a\u001e\u0003\u0002\u0002\u0002\u001b\u0019\u0003",
    "\u0002\u0002\u0002\u001c\u001f\u0005\u0006\u0004\u0002\u001d\u001f\u0005",
    "\u0004\u0003\u0002\u001e\u001c\u0003\u0002\u0002\u0002\u001e\u001d\u0003",
    "\u0002\u0002\u0002\u001f#\u0003\u0002\u0002\u0002 \"\u0007\u0004\u0002",
    "\u0002! \u0003\u0002\u0002\u0002\"%\u0003\u0002\u0002\u0002#!\u0003",
    "\u0002\u0002\u0002#$\u0003\u0002\u0002\u0002$&\u0003\u0002\u0002\u0002",
    "%#\u0003\u0002\u0002\u0002&\'\u0007\u0002\u0002\u0003\'\u0003\u0003",
    "\u0002\u0002\u0002()\u0007\u0006\u0002\u0002)*\u0007\n\u0002\u0002*",
    "+\u0005\f\u0007\u0002+/\u0007\r\u0002\u0002,.\u0007\u0004\u0002\u0002",
    "-,\u0003\u0002\u0002\u0002.1\u0003\u0002\u0002\u0002/-\u0003\u0002\u0002",
    "\u0002/0\u0003\u0002\u0002\u000203\u0003\u0002\u0002\u00021/\u0003\u0002",
    "\u0002\u000224\u0005\b\u0005\u000232\u0003\u0002\u0002\u000234\u0003",
    "\u0002\u0002\u000245\u0003\u0002\u0002\u000256\u0007\u0007\u0002\u0002",
    "67\u0007\u0014\u0002\u000278\u0007\u0015\u0002\u00028\u0005\u0003\u0002",
    "\u0002\u00029:\u0007\u0006\u0002\u0002:;\u0007\t\u0002\u0002;<\u0005",
    "\f\u0007\u0002<=\t\u0002\u0002\u0002=\u0007\u0003\u0002\u0002\u0002",
    ">B\u0005\n\u0006\u0002?A\u0007\u0004\u0002\u0002@?\u0003\u0002\u0002",
    "\u0002AD\u0003\u0002\u0002\u0002B@\u0003\u0002\u0002\u0002BC\u0003\u0002",
    "\u0002\u0002CN\u0003\u0002\u0002\u0002DB\u0003\u0002\u0002\u0002EI\u0005",
    "\n\u0006\u0002FH\u0007\u0004\u0002\u0002GF\u0003\u0002\u0002\u0002H",
    "K\u0003\u0002\u0002\u0002IG\u0003\u0002\u0002\u0002IJ\u0003\u0002\u0002",
    "\u0002JM\u0003\u0002\u0002\u0002KI\u0003\u0002\u0002\u0002LE\u0003\u0002",
    "\u0002\u0002MP\u0003\u0002\u0002\u0002NL\u0003\u0002\u0002\u0002NO\u0003",
    "\u0002\u0002\u0002O\t\u0003\u0002\u0002\u0002PN\u0003\u0002\u0002\u0002",
    "QV\u0005\u0006\u0004\u0002RV\u0005\u0004\u0003\u0002SV\u0005\u0012\n",
    "\u0002TV\u0005\u0014\u000b\u0002UQ\u0003\u0002\u0002\u0002UR\u0003\u0002",
    "\u0002\u0002US\u0003\u0002\u0002\u0002UT\u0003\u0002\u0002\u0002V\u000b",
    "\u0003\u0002\u0002\u0002WY\u0007\f\u0002\u0002XW\u0003\u0002\u0002\u0002",
    "Y\\\u0003\u0002\u0002\u0002ZX\u0003\u0002\u0002\u0002Z[\u0003\u0002",
    "\u0002\u0002[o\u0003\u0002\u0002\u0002\\Z\u0003\u0002\u0002\u0002]f",
    "\u0005\u000e\b\u0002^`\u0007\f\u0002\u0002_^\u0003\u0002\u0002\u0002",
    "`a\u0003\u0002\u0002\u0002a_\u0003\u0002\u0002\u0002ab\u0003\u0002\u0002",
    "\u0002bc\u0003\u0002\u0002\u0002ce\u0005\u000e\b\u0002d_\u0003\u0002",
    "\u0002\u0002eh\u0003\u0002\u0002\u0002fd\u0003\u0002\u0002\u0002fg\u0003",
    "\u0002\u0002\u0002gl\u0003\u0002\u0002\u0002hf\u0003\u0002\u0002\u0002",
    "ik\u0007\f\u0002\u0002ji\u0003\u0002\u0002\u0002kn\u0003\u0002\u0002",
    "\u0002lj\u0003\u0002\u0002\u0002lm\u0003\u0002\u0002\u0002mp\u0003\u0002",
    "\u0002\u0002nl\u0003\u0002\u0002\u0002o]\u0003\u0002\u0002\u0002op\u0003",
    "\u0002\u0002\u0002p\r\u0003\u0002\u0002\u0002qr\u0007\u000f\u0002\u0002",
    "rs\u0007\u0010\u0002\u0002sv\u0005\u0010\t\u0002tv\u0007\u000f\u0002",
    "\u0002uq\u0003\u0002\u0002\u0002ut\u0003\u0002\u0002\u0002v\u000f\u0003",
    "\u0002\u0002\u0002w{\u0007\u0011\u0002\u0002x{\u0007\u0012\u0002\u0002",
    "y{\u0005\u0012\n\u0002zw\u0003\u0002\u0002\u0002zx\u0003\u0002\u0002",
    "\u0002zy\u0003\u0002\u0002\u0002{\u0011\u0003\u0002\u0002\u0002|\u0080",
    "\t\u0003\u0002\u0002}\u007f\u0007\u0016\u0002\u0002~}\u0003\u0002\u0002",
    "\u0002\u007f\u0082\u0003\u0002\u0002\u0002\u0080~\u0003\u0002\u0002",
    "\u0002\u0080\u0081\u0003\u0002\u0002\u0002\u0081\u0083\u0003\u0002\u0002",
    "\u0002\u0082\u0080\u0003\u0002\u0002\u0002\u0083\u0087\u0007\u0018\u0002",
    "\u0002\u0084\u0086\u0007\u0016\u0002\u0002\u0085\u0084\u0003\u0002\u0002",
    "\u0002\u0086\u0089\u0003\u0002\u0002\u0002\u0087\u0085\u0003\u0002\u0002",
    "\u0002\u0087\u0088\u0003\u0002\u0002\u0002\u0088\u008a\u0003\u0002\u0002",
    "\u0002\u0089\u0087\u0003\u0002\u0002\u0002\u008a\u008b\u0007\u0017\u0002",
    "\u0002\u008b\u0013\u0003\u0002\u0002\u0002\u008c\u008d\u0007\b\u0002",
    "\u0002\u008d\u0015\u0003\u0002\u0002\u0002\u0014\u0019\u001e#/3BINU",
    "Zaflouz\u0080\u0087"].join("");


var atn$1 = new antlr4$1.atn.ATNDeserializer().deserialize(serializedATN$1);

var decisionsToDFA$1 = atn$1.decisionToState.map( function(ds, index) { return new antlr4$1.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4$1.PredictionContextCache();

var literalNames = [ null, null, null, null, "'<'", "'</'", null, null, 
                     null, null, null, null, "'/>'", null, "'='", null, 
                     null, null, null, null, null, "'}}'" ];

var symbolicNames = [ null, "HTML_COMMENT", "WS", "VAR_OPEN", "TAG_OPEN", 
                      "END_TAG_OPEN", "TEXT_CONTENT", "EMPTY_TAG_NAME", 
                      "TAG_NAME", "TAG_HTML_COMMENT", "TAG_WS", "TAG_CLOSE", 
                      "TAG_SLASH_CLOSE", "ATTR_NAME", "ATTR_EQ", "ATTR_STRING", 
                      "ATTR_STRING_SINGLE_QUOTE", "TAG_VAR_OPEN", "END_TAG_NAME", 
                      "END_TAG_CLOSE", "VAR_WS", "VAR_CLOSE", "VAR_NAME" ];

var ruleNames =  [ "template", "element", "htmlEmptyElement", "content", 
                   "contentUnit", "attributes", "attribute", "attributeValue", 
                   "variable", "textContent" ];

function HandleDomParser (input) {
	antlr4$1.Parser.call(this, input);
    this._interp = new antlr4$1.atn.ParserATNSimulator(this, atn$1, decisionsToDFA$1, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

HandleDomParser.prototype = Object.create(antlr4$1.Parser.prototype);
HandleDomParser.prototype.constructor = HandleDomParser;

Object.defineProperty(HandleDomParser.prototype, "atn", {
	get : function() {
		return atn$1;
	}
});

HandleDomParser.EOF = antlr4$1.Token.EOF;
HandleDomParser.HTML_COMMENT = 1;
HandleDomParser.WS = 2;
HandleDomParser.VAR_OPEN = 3;
HandleDomParser.TAG_OPEN = 4;
HandleDomParser.END_TAG_OPEN = 5;
HandleDomParser.TEXT_CONTENT = 6;
HandleDomParser.EMPTY_TAG_NAME = 7;
HandleDomParser.TAG_NAME = 8;
HandleDomParser.TAG_HTML_COMMENT = 9;
HandleDomParser.TAG_WS = 10;
HandleDomParser.TAG_CLOSE = 11;
HandleDomParser.TAG_SLASH_CLOSE = 12;
HandleDomParser.ATTR_NAME = 13;
HandleDomParser.ATTR_EQ = 14;
HandleDomParser.ATTR_STRING = 15;
HandleDomParser.ATTR_STRING_SINGLE_QUOTE = 16;
HandleDomParser.TAG_VAR_OPEN = 17;
HandleDomParser.END_TAG_NAME = 18;
HandleDomParser.END_TAG_CLOSE = 19;
HandleDomParser.VAR_WS = 20;
HandleDomParser.VAR_CLOSE = 21;
HandleDomParser.VAR_NAME = 22;

HandleDomParser.RULE_template = 0;
HandleDomParser.RULE_element = 1;
HandleDomParser.RULE_htmlEmptyElement = 2;
HandleDomParser.RULE_content = 3;
HandleDomParser.RULE_contentUnit = 4;
HandleDomParser.RULE_attributes = 5;
HandleDomParser.RULE_attribute = 6;
HandleDomParser.RULE_attributeValue = 7;
HandleDomParser.RULE_variable = 8;
HandleDomParser.RULE_textContent = 9;


function TemplateContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_template;
    return this;
}

TemplateContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
TemplateContext.prototype.constructor = TemplateContext;

TemplateContext.prototype.EOF = function() {
    return this.getToken(HandleDomParser.EOF, 0);
};

TemplateContext.prototype.htmlEmptyElement = function() {
    return this.getTypedRuleContext(HtmlEmptyElementContext,0);
};

TemplateContext.prototype.element = function() {
    return this.getTypedRuleContext(ElementContext,0);
};

TemplateContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(HandleDomParser.WS);
    } else {
        return this.getToken(HandleDomParser.WS, i);
    }
};


TemplateContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterTemplate(this);
	}
};

TemplateContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitTemplate(this);
	}
};




HandleDomParser.TemplateContext = TemplateContext;

HandleDomParser.prototype.template = function() {

    var localctx = new TemplateContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, HandleDomParser.RULE_template);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 23;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.WS) {
            this.state = 20;
            this.match(HandleDomParser.WS);
            this.state = 25;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 28;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
        switch(la_) {
        case 1:
            this.state = 26;
            this.htmlEmptyElement();
            break;

        case 2:
            this.state = 27;
            this.element();
            break;

        }
        this.state = 33;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.WS) {
            this.state = 30;
            this.match(HandleDomParser.WS);
            this.state = 35;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 36;
        this.match(HandleDomParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ElementContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_element;
    return this;
}

ElementContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
ElementContext.prototype.constructor = ElementContext;

ElementContext.prototype.TAG_OPEN = function() {
    return this.getToken(HandleDomParser.TAG_OPEN, 0);
};

ElementContext.prototype.TAG_NAME = function() {
    return this.getToken(HandleDomParser.TAG_NAME, 0);
};

ElementContext.prototype.attributes = function() {
    return this.getTypedRuleContext(AttributesContext,0);
};

ElementContext.prototype.TAG_CLOSE = function() {
    return this.getToken(HandleDomParser.TAG_CLOSE, 0);
};

ElementContext.prototype.END_TAG_OPEN = function() {
    return this.getToken(HandleDomParser.END_TAG_OPEN, 0);
};

ElementContext.prototype.END_TAG_NAME = function() {
    return this.getToken(HandleDomParser.END_TAG_NAME, 0);
};

ElementContext.prototype.END_TAG_CLOSE = function() {
    return this.getToken(HandleDomParser.END_TAG_CLOSE, 0);
};

ElementContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(HandleDomParser.WS);
    } else {
        return this.getToken(HandleDomParser.WS, i);
    }
};


ElementContext.prototype.content = function() {
    return this.getTypedRuleContext(ContentContext,0);
};

ElementContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterElement(this);
	}
};

ElementContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitElement(this);
	}
};




HandleDomParser.ElementContext = ElementContext;

HandleDomParser.prototype.element = function() {

    var localctx = new ElementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, HandleDomParser.RULE_element);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 38;
        this.match(HandleDomParser.TAG_OPEN);
        this.state = 39;
        this.match(HandleDomParser.TAG_NAME);
        this.state = 40;
        this.attributes();
        this.state = 41;
        this.match(HandleDomParser.TAG_CLOSE);
        this.state = 45;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.WS) {
            this.state = 42;
            this.match(HandleDomParser.WS);
            this.state = 47;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 49;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << HandleDomParser.VAR_OPEN) | (1 << HandleDomParser.TAG_OPEN) | (1 << HandleDomParser.TEXT_CONTENT) | (1 << HandleDomParser.TAG_VAR_OPEN))) !== 0)) {
            this.state = 48;
            this.content();
        }

        this.state = 51;
        this.match(HandleDomParser.END_TAG_OPEN);
        this.state = 52;
        this.match(HandleDomParser.END_TAG_NAME);
        this.state = 53;
        this.match(HandleDomParser.END_TAG_CLOSE);
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function HtmlEmptyElementContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_htmlEmptyElement;
    return this;
}

HtmlEmptyElementContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
HtmlEmptyElementContext.prototype.constructor = HtmlEmptyElementContext;

HtmlEmptyElementContext.prototype.TAG_OPEN = function() {
    return this.getToken(HandleDomParser.TAG_OPEN, 0);
};

HtmlEmptyElementContext.prototype.EMPTY_TAG_NAME = function() {
    return this.getToken(HandleDomParser.EMPTY_TAG_NAME, 0);
};

HtmlEmptyElementContext.prototype.attributes = function() {
    return this.getTypedRuleContext(AttributesContext,0);
};

HtmlEmptyElementContext.prototype.TAG_CLOSE = function() {
    return this.getToken(HandleDomParser.TAG_CLOSE, 0);
};

HtmlEmptyElementContext.prototype.TAG_SLASH_CLOSE = function() {
    return this.getToken(HandleDomParser.TAG_SLASH_CLOSE, 0);
};

HtmlEmptyElementContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterHtmlEmptyElement(this);
	}
};

HtmlEmptyElementContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitHtmlEmptyElement(this);
	}
};




HandleDomParser.HtmlEmptyElementContext = HtmlEmptyElementContext;

HandleDomParser.prototype.htmlEmptyElement = function() {

    var localctx = new HtmlEmptyElementContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, HandleDomParser.RULE_htmlEmptyElement);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 55;
        this.match(HandleDomParser.TAG_OPEN);
        this.state = 56;
        this.match(HandleDomParser.EMPTY_TAG_NAME);
        this.state = 57;
        this.attributes();
        this.state = 58;
        _la = this._input.LA(1);
        if(!(_la===HandleDomParser.TAG_CLOSE || _la===HandleDomParser.TAG_SLASH_CLOSE)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ContentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_content;
    return this;
}

ContentContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
ContentContext.prototype.constructor = ContentContext;

ContentContext.prototype.contentUnit = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ContentUnitContext);
    } else {
        return this.getTypedRuleContext(ContentUnitContext,i);
    }
};

ContentContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(HandleDomParser.WS);
    } else {
        return this.getToken(HandleDomParser.WS, i);
    }
};


ContentContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterContent(this);
	}
};

ContentContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitContent(this);
	}
};




HandleDomParser.ContentContext = ContentContext;

HandleDomParser.prototype.content = function() {

    var localctx = new ContentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, HandleDomParser.RULE_content);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 60;
        this.contentUnit();
        this.state = 64;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.WS) {
            this.state = 61;
            this.match(HandleDomParser.WS);
            this.state = 66;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 76;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << HandleDomParser.VAR_OPEN) | (1 << HandleDomParser.TAG_OPEN) | (1 << HandleDomParser.TEXT_CONTENT) | (1 << HandleDomParser.TAG_VAR_OPEN))) !== 0)) {
            this.state = 67;
            this.contentUnit();
            this.state = 71;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===HandleDomParser.WS) {
                this.state = 68;
                this.match(HandleDomParser.WS);
                this.state = 73;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            this.state = 78;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ContentUnitContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_contentUnit;
    return this;
}

ContentUnitContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
ContentUnitContext.prototype.constructor = ContentUnitContext;

ContentUnitContext.prototype.htmlEmptyElement = function() {
    return this.getTypedRuleContext(HtmlEmptyElementContext,0);
};

ContentUnitContext.prototype.element = function() {
    return this.getTypedRuleContext(ElementContext,0);
};

ContentUnitContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

ContentUnitContext.prototype.textContent = function() {
    return this.getTypedRuleContext(TextContentContext,0);
};

ContentUnitContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterContentUnit(this);
	}
};

ContentUnitContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitContentUnit(this);
	}
};




HandleDomParser.ContentUnitContext = ContentUnitContext;

HandleDomParser.prototype.contentUnit = function() {

    var localctx = new ContentUnitContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, HandleDomParser.RULE_contentUnit);
    try {
        this.state = 83;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,8,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 79;
            this.htmlEmptyElement();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 80;
            this.element();
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 81;
            this.variable();
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 82;
            this.textContent();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function AttributesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_attributes;
    return this;
}

AttributesContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
AttributesContext.prototype.constructor = AttributesContext;

AttributesContext.prototype.TAG_WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(HandleDomParser.TAG_WS);
    } else {
        return this.getToken(HandleDomParser.TAG_WS, i);
    }
};


AttributesContext.prototype.attribute = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(AttributeContext);
    } else {
        return this.getTypedRuleContext(AttributeContext,i);
    }
};

AttributesContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterAttributes(this);
	}
};

AttributesContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitAttributes(this);
	}
};




HandleDomParser.AttributesContext = AttributesContext;

HandleDomParser.prototype.attributes = function() {

    var localctx = new AttributesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, HandleDomParser.RULE_attributes);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 88;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.TAG_WS) {
            this.state = 85;
            this.match(HandleDomParser.TAG_WS);
            this.state = 90;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 109;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===HandleDomParser.ATTR_NAME) {
            this.state = 91;
            this.attribute();
            this.state = 100;
            this._errHandler.sync(this);
            var _alt = this._interp.adaptivePredict(this._input,11,this._ctx);
            while(_alt!=2 && _alt!=antlr4$1.atn.ATN.INVALID_ALT_NUMBER) {
                if(_alt===1) {
                    this.state = 93; 
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                    do {
                        this.state = 92;
                        this.match(HandleDomParser.TAG_WS);
                        this.state = 95; 
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                    } while(_la===HandleDomParser.TAG_WS);
                    this.state = 97;
                    this.attribute(); 
                }
                this.state = 102;
                this._errHandler.sync(this);
                _alt = this._interp.adaptivePredict(this._input,11,this._ctx);
            }

            this.state = 106;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===HandleDomParser.TAG_WS) {
                this.state = 103;
                this.match(HandleDomParser.TAG_WS);
                this.state = 108;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
        }

    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function AttributeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_attribute;
    return this;
}

AttributeContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
AttributeContext.prototype.constructor = AttributeContext;

AttributeContext.prototype.ATTR_NAME = function() {
    return this.getToken(HandleDomParser.ATTR_NAME, 0);
};

AttributeContext.prototype.ATTR_EQ = function() {
    return this.getToken(HandleDomParser.ATTR_EQ, 0);
};

AttributeContext.prototype.attributeValue = function() {
    return this.getTypedRuleContext(AttributeValueContext,0);
};

AttributeContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterAttribute(this);
	}
};

AttributeContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitAttribute(this);
	}
};




HandleDomParser.AttributeContext = AttributeContext;

HandleDomParser.prototype.attribute = function() {

    var localctx = new AttributeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, HandleDomParser.RULE_attribute);
    try {
        this.state = 115;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,14,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 111;
            this.match(HandleDomParser.ATTR_NAME);
            this.state = 112;
            this.match(HandleDomParser.ATTR_EQ);
            this.state = 113;
            this.attributeValue();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 114;
            this.match(HandleDomParser.ATTR_NAME);
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function AttributeValueContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_attributeValue;
    return this;
}

AttributeValueContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
AttributeValueContext.prototype.constructor = AttributeValueContext;

AttributeValueContext.prototype.ATTR_STRING = function() {
    return this.getToken(HandleDomParser.ATTR_STRING, 0);
};

AttributeValueContext.prototype.ATTR_STRING_SINGLE_QUOTE = function() {
    return this.getToken(HandleDomParser.ATTR_STRING_SINGLE_QUOTE, 0);
};

AttributeValueContext.prototype.variable = function() {
    return this.getTypedRuleContext(VariableContext,0);
};

AttributeValueContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterAttributeValue(this);
	}
};

AttributeValueContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitAttributeValue(this);
	}
};




HandleDomParser.AttributeValueContext = AttributeValueContext;

HandleDomParser.prototype.attributeValue = function() {

    var localctx = new AttributeValueContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, HandleDomParser.RULE_attributeValue);
    try {
        this.state = 120;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case HandleDomParser.ATTR_STRING:
            this.enterOuterAlt(localctx, 1);
            this.state = 117;
            this.match(HandleDomParser.ATTR_STRING);
            break;
        case HandleDomParser.ATTR_STRING_SINGLE_QUOTE:
            this.enterOuterAlt(localctx, 2);
            this.state = 118;
            this.match(HandleDomParser.ATTR_STRING_SINGLE_QUOTE);
            break;
        case HandleDomParser.VAR_OPEN:
        case HandleDomParser.TAG_VAR_OPEN:
            this.enterOuterAlt(localctx, 3);
            this.state = 119;
            this.variable();
            break;
        default:
            throw new antlr4$1.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function VariableContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_variable;
    return this;
}

VariableContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
VariableContext.prototype.constructor = VariableContext;

VariableContext.prototype.VAR_NAME = function() {
    return this.getToken(HandleDomParser.VAR_NAME, 0);
};

VariableContext.prototype.VAR_CLOSE = function() {
    return this.getToken(HandleDomParser.VAR_CLOSE, 0);
};

VariableContext.prototype.VAR_OPEN = function() {
    return this.getToken(HandleDomParser.VAR_OPEN, 0);
};

VariableContext.prototype.TAG_VAR_OPEN = function() {
    return this.getToken(HandleDomParser.TAG_VAR_OPEN, 0);
};

VariableContext.prototype.VAR_WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(HandleDomParser.VAR_WS);
    } else {
        return this.getToken(HandleDomParser.VAR_WS, i);
    }
};


VariableContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterVariable(this);
	}
};

VariableContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitVariable(this);
	}
};




HandleDomParser.VariableContext = VariableContext;

HandleDomParser.prototype.variable = function() {

    var localctx = new VariableContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, HandleDomParser.RULE_variable);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 122;
        _la = this._input.LA(1);
        if(!(_la===HandleDomParser.VAR_OPEN || _la===HandleDomParser.TAG_VAR_OPEN)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 126;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.VAR_WS) {
            this.state = 123;
            this.match(HandleDomParser.VAR_WS);
            this.state = 128;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 129;
        this.match(HandleDomParser.VAR_NAME);
        this.state = 133;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===HandleDomParser.VAR_WS) {
            this.state = 130;
            this.match(HandleDomParser.VAR_WS);
            this.state = 135;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 136;
        this.match(HandleDomParser.VAR_CLOSE);
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function TextContentContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4$1.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = HandleDomParser.RULE_textContent;
    return this;
}

TextContentContext.prototype = Object.create(antlr4$1.ParserRuleContext.prototype);
TextContentContext.prototype.constructor = TextContentContext;

TextContentContext.prototype.TEXT_CONTENT = function() {
    return this.getToken(HandleDomParser.TEXT_CONTENT, 0);
};

TextContentContext.prototype.enterRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.enterTextContent(this);
	}
};

TextContentContext.prototype.exitRule = function(listener) {
    if(listener instanceof HandleDomParserListener$1 ) {
        listener.exitTextContent(this);
	}
};




HandleDomParser.TextContentContext = TextContentContext;

HandleDomParser.prototype.textContent = function() {

    var localctx = new TextContentContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, HandleDomParser.RULE_textContent);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 138;
        this.match(HandleDomParser.TEXT_CONTENT);
    } catch (re) {
    	if(re instanceof antlr4$1.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


var HandleDomParser_2 = HandleDomParser;

const namedEntities = {
    "&amp;": "&",
    "&gt;": ">",
    "&lt;": "<",
    "&quot;": "\"",
    "&nbsp;": "\0xa0",
};
function convertEntities(text) {
    return text.replace(/&#?[a-z0-9]{2,8};/ig, (match) => {
        const lower = match.toLowerCase();
        if (lower[1] === "#") {
            return lower[2] === "x" ? hexEntityToChar(lower) : decimalEntityToChar(lower);
        }
        else {
            if (!namedEntities[lower]) {
                const listStr = Object.keys(namedEntities).join(", ");
                throw new Error(`${lower} is not a supported named entity. Supported are: ${listStr}.`);
            }
            return namedEntities[lower];
        }
    });
}
function hexEntityToChar(hexRef) {
    const codepoint = parseInt(hexRef.substring(3, hexRef.length - 1), 16);
    return String.fromCodePoint(codepoint);
}
function decimalEntityToChar(decRef) {
    const codepoint = parseInt(decRef.substring(2, decRef.length - 1), 10);
    return String.fromCodePoint(codepoint);
}

class AstExtractor extends HandleDomParserListener_2 {
    constructor() {
        super();
        this.stack = [];
    }
    exitTemplate() {
        if (this.stack.length !== 0)
            throw new Error("Non-empty stack");
    }
    enterElement(ctx) {
        // console.log("... enterElement", ctx.getText())
        const name = ctx.TAG_NAME().getText().toLowerCase();
        const el = {
            nodeType: "element",
            nodeName: name,
        };
        this.registerElement(el);
    }
    exitElement(ctx) {
        // console.log("... exitElement", ctx.getText())
        const closeTag = ctx.END_TAG_NAME().getText().toLowerCase();
        const el = this.stack.pop();
        if (!el)
            throw new Error("Stack is empty");
        if (el.nodeName !== closeTag)
            throw new Error(`Element <${el.nodeName}> has an invalid closing tag </${closeTag}>`);
    }
    enterHtmlEmptyElement(ctx) {
        // console.log("... enterHtmlEmptyElement", ctx.getText())
        const name = ctx.EMPTY_TAG_NAME().getText().toLowerCase();
        const el = {
            nodeType: "element",
            nodeName: name,
            emptyTag: true
        };
        this.registerElement(el);
    }
    exitHtmlEmptyElement(ctx) {
        // console.log("... exitHtmlEmptyElement", ctx.getText())
        this.stack.pop();
    }
    enterAttribute(ctx) {
        // console.log("... enterAttribute", ctx.getText())
        const attribute = {
            name: ctx.ATTR_NAME().getText().toLowerCase()
        };
        this.currentAttribute = attribute;
        const attrVal = ctx.attributeValue();
        if (attrVal) {
            const rawValue = attrVal.getText().trim();
            if (rawValue[0] !== "{")
                attribute.value = convertEntities(rawValue.substring(1, rawValue.length - 1));
        }
        addAttributeTo(this.getParentElement(), attribute);
    }
    exitAttribute() {
        this.currentAttribute = undefined;
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
    enterTextContent(ctx) {
        // console.log("... enterTextContent", ctx.getText())
        const text = convertEntities(ctx.getText());
        addChildTo(this.getParentElement(), text);
    }
    enterVariable(ctx) {
        // console.log("... enterVariable", ctx.getText())
        const variableName = ctx.VAR_NAME().getText();
        const variable = {
            nodeType: "variable",
            variableName
        };
        if (this.currentAttribute)
            this.currentAttribute.value = variable;
        else
            addChildTo(this.getParentElement(), variable);
    }
    registerElement(el) {
        if (!this.root)
            this.root = el;
        if (this.stack.length !== 0)
            addChildTo(this.getParentElement(), el);
        this.stack.push(el);
    }
    getParentElement() {
        const el = this.stack[this.stack.length - 1];
        if (!el)
            throw new Error("Missing parent");
        return el;
    }
}
function addChildTo(el, child) {
    if (!el.children)
        el.children = [];
    el.children.push(child);
}
function addAttributeTo(el, attr) {
    if (!el.attributes)
        el.attributes = [];
    el.attributes.push(attr);
}

function parseHandledom(source) {
    const chars = new antlr4.InputStream(source);
    const lexer = new HandleDomLexer_2(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new HandleDomParser_2(tokens);
    parser.buildParseTrees = true;
    const errors = [];
    const errorListener = {
        syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
            errors.push(`Syntax error at line ${line}:${column}, ${msg}`);
        }
    };
    lexer.removeErrorListeners();
    lexer.addErrorListener(errorListener);
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    const template = parser.template();
    if (errors.length > 0)
        throw new Error(errors.join("\n"));
    const extractor = new AstExtractor();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(extractor, template);
    return extractor.root;
}

function compileHandledom(template) {
    const ast = parseHandledom(template);
    return generateCode(ast);
}

exports.compileHandledom = compileHandledom;
exports.parseHandledom = parseHandledom;
