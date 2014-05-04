/**
 * Code generation.
 */

var extend = require('xtend')
var curry  = require('core.lambda').curry


exports.node = curry(2, node)
function node(type, body) {
  return extend({ type: type }
               , body)
}

exports.program = program
function program(stmt) {
  return node('Program', { body: stmt })
}

exports.fn = curry(4, fn)
function fn(id, params, body, others) {
  return node('FunctionExpression'
             , extend({ id: id
                      , params: params
                      , body: body }
                     , others))
}

exports.empty = emptyStmt
function emptyStmt() {
  return node('EmptyStatement')
}

exports.block = blockStmt
function blockStmt(xs) {
  return node('BlockStatement', { body: xs })
}

exports.expr = exprStmt
function exprStmt(x) {
  return node('ExpressionStatement', { expression: x })
}

exports['if'] = curry(3, ifStmt)
function ifStmt(test, consequent, alternate) {
  return node('IfStatement', { test: test
                             , consequent: consequent
                             , alternate: alternate })
}

exports.label = curry(2, labelStmt)
function labelStmt(id, body) {
  return node('LabeledStatement', { label: id
                                  , body: body })
}

exports['break'] = breakStmt
function breakStmt(id) {
  return node('BreakStatement', { label: id })
}

exports['continue'] = continueStmt
function continueStmt(id) {
  return node('ContinueStatement', { label: id })
}

exports['return'] = returnStmt
function returnStmt(x) {
  return node('ReturnStatement', { argument: x })
}

exports['throw'] = throwStmt
function throwStmt(x) {
  return node('ThrowStatement', { argument: x })
}

exports['debugger'] = debuggerStmt
function debuggerStmt() {
  return node('DebuggerStatement')
}

exports['var'] = curry(2, varDecl)
function varDecl(id, val) {
  return node('VariableDeclaration'
             , { kind: 'var'
               , declarations: [ node('VariableDeclarator'
                                     , { id: id
                                       , init: val }) ]})
}

exports['this'] = thisExpr
function thisExpr() {
  return node('ThisExpression')
}

exports.array = arrayExpr
function arrayExpr(xs) {
  return node('ArrayExpression', { elements: xs })
}

exports.obj = objExpr
function objExpr(xs) {
  return node('ObjectExpression'
             , xs.map(function(x) {
                 return { key: x.key, value: x.value, kind: 'init' } }))
}

exports.unaryExpr = unaryExpr = curry(3, unaryExpr)
function unaryExpr(op, prefix, arg) {
  return node('UnaryExpression', { operator: op
                                 , prefix: prefix
                                 , argument: arg })
}

exports.unaryPlus = unaryExpr('+', true)
exports.unaryMinus = unaryExpr('-', true)
exports.unaryNot = unaryExpr('!', true)

exports.binaryExpr = binaryExpr = curry(3, binaryExpr)
function binaryExpr(op, left, right) {
  return node('BinaryExpression', { operator: op
                                  , left: left
                                  , right: right })
}


exports.plus = binaryExpr('+')
exports.minus = binaryExpr('-')
exports.mul = binaryExpr('*')
exports.div = binaryExpr('/')
exports.eq = binaryExpr('===')
exports.neq = binaryExpr('!==')

exports.logicalExpr = logicalExpr = curry(3, logicalExpr)
function logicalExpr(op, left, right) {
  return node('LogicalExpression', { operator: op
                                   , left: left
                                   , right: right })
}

exports.and = logicalExpr('&&')
exports.or = logicalExpr('||')


exports.cond = curry(3, condition)
function condition(test, consequent, alternate) {
  return node('ConditionalExpression', { test: test
                                       , consequent: consequent
                                       , alternate: alternate })
}

exports.id = id
function id(a) {
  return node('Identifier', { name: a })
}

exports.lit = lit
function lit(a) {
  return node('Literal', { value: a })
}