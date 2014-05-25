// Copyright (c) 2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

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
  return node( 'FunctionExpression'
             , extend( { id: id
                       , params: params
                       , body: body
                       , expression: false
                       , generator: false }
                     , others))
}

exports.lambda = curry(2, lambda)
function lambda(arg, ex) {
  return fexpr([arg], ex)
}

exports.fexpr = curry(2, fexpr)
function fexpr(args, ex) {
  return fn(null, args, blockStmt([returnStmt(ex)]), {})
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

exports.array = array
function array(xs) {
  return node('ArrayExpression', { elements: xs })
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
  return varsDecl([[id, val]])
}

exports.vars = varsDecl
function varsDecl(xs) {
  return node('VariableDeclaration'
             , { kind: 'var'
               , declarations: xs.map(function(x) {
                                 return node('VariableDeclarator',
                                             { id: x[0], init: x[1] })}) })
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
             , { properties: xs.map(function(x) {
                                      return { key: x.key
                                             , value: x.value
                                             , kind: 'init' } })})
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
var eq = exports.eq = binaryExpr('===')
exports.neq = binaryExpr('!==')
var instanceOf = binaryExpr('instanceof')

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

exports.call = curry(2, call)
function call(callee, xs) {
  return node('CallExpression', { callee: callee
                                , arguments: xs })
}

exports.new = curry(2, newExpr)
function newExpr(callee, xs) {
  return node('NewExpression', { callee: callee
                               , arguments: xs })
}

exports.error = curry(2, error)
function error(type, message) {
  return newExpr(type, [lit(message)])
}

exports.raise = raise
function raise(error) {
  return call(fn( null
                , []
                , blockStmt([throwStmt(error)]))
             , [])
}

exports.qualId = qualId
function qualId(ids) {
  return ids.reduce(function(a, b){
                      return node('MemberExpression'
                                 , { object: a
                                   , property: b
                                   , computed: false }) })
}

exports.set = curry(2, set)
function set(a, b) {
  return node('AssignmentExpression', { operator: '='
                                      , left: a
                                      , right: b })
}

exports.member = member
function member(a, b, computed) {
  return node('MemberExpression'
             , { object: a, property: b, computed: computed })
}

exports.methodCall = curry(3, methodCall)
function methodCall(a, m, args) {
  return call(member(a, m, false), args)
}

exports.adtCase = adtCase
function adtCase(as) {
  return objExpr(as.map(function(a){ return { key: a, value: id('$any') }}))
}

exports.adt = adt
function adt(as) {
  return call( id('$data')
             , [objExpr(as.map(function(a){
                                 return { key: a[0], value: a[1] }}))])
}

exports.match = curry(3, match)
function match(n, a, cases) {
  return call( fn( null, [id(n)]
                 , blockStmt(cases.map(matchCase))
                 , {})
             , [a])

  function matchCase(c) {
    return c[0] === 'NamePatt'?  matchNamePatt(c[1], c[2])
    :      c[0] === 'ValPatt'?   matchValPatt(c[1], c[2])
    :      c[0] === 'RecPatt'?   matchRecPatt(c[1], c[2])
    :      c[0] === 'ProdPatt'?  matchProdPatt(c[1], c[2])
    :      c[0] === 'DataPatt'?  matchDataPatt(c[1], c[2], c[3])
    :      /* otherwise */       null
  }

  function matchNamePatt(c, e) {
    return returnStmt(call(lambda(c, e), [id(n)]))
  }
  function matchValPatt(c, e) {
    return ifStmt(eq(c, id(n)), returnStmt(e))
  }
  function matchRecPatt(c, e) {
    return ifStmt(call(id('$matchesInterface'), [id(n), array(c.map(idLit))])
                 , returnStmt(call( fexpr(c.map(last), e)
                                  , c.map(getter))))

    function getter(a){ return member(id(n), a[0]) }
    function idLit(a){ return lit(first(a).name) }
  }
  function matchProdPatt(c, e) {
    return matchRecPatt( c.map(last).map(function(a, i){ return [id('_' + i), id(a)] })
                       , e)
  }
  function matchDataPatt(tag, ids, e) {
    return ifStmt( instanceOf(id(n), tag)
                 , returnStmt(call( fexpr(ids, e)
                                  , ids.map(getter))))

    function getter(_, i) {
      return methodCall(id(n), id('get'), [lit(i)]) }
  }
  function first(a){ return a[0] }
  function last(a){ return a[a.length - 1] }
}

exports.tuple = tuple
function tuple(as) {
  return objExpr(as.map(function(a, i) {
                          return { key: id('_' + i), value: a }}))
}

exports.record = record
function record(as) {
  return objExpr(as.map(function(a) {
                          return { key: a[0], value: a[1] }}))
}

exports.visible = curry(2, visible)
function visible(a, b) {
  return set(member(id('$export'), a, false), b)
}

exports.module = curry(2, moduleDecl)
function moduleDecl(args, body) {
  return call(id('$curry')
             ,[ lit(args.length)
              , fn( null, args
                  , blockStmt(
                      [ varDecl(id('$export'), objExpr([])) ]
                      .concat(body)
                       .concat(returnStmt(id('$export'))))
                  , {})])
}

exports.exportMod = exportMod
function exportMod(a) {
  return set(member(id('module'), id('exports'), false), a)
}