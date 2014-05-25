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

var path            = require('path')
var vm              = require('vm')
var extend          = require('xtend')
var extendMut       = require('xtend/mutable')
var jsm             = require('../../lib/core')
var adt             = require('adt')
var curry           = require('core.lambda').curry
var show            = require('util').inspect
var deepEqual       = require('deep-equal')
var Future          = require('data.future')
var internalClassOf = Function.call.bind({}.toString)

function classOf(a) {
  return internalClassOf(a).slice(8, -1)
}

function typeCheck(expected, actual) {
  if (classOf(actual) !== expected)
    throw new TypeError('Expected a value of type ' + expected
                       + ', got ' + classOf(actual) + ': ' + show(actual))
}

exports.$eq = $eq
function $eq(a){ return function(b) {
  return a && a.equals?   a.equals(b)
  :      /* otherwise */  a === b
}}

exports.$neq = $neq
function $neq(a){ return function(b) {
  return !$eq(a)(b)
}}

exports.$mul = $mul
function $mul(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a * b
}}

exports.$div = $div
function $div(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a / b
}}

exports.$mod = $mod
function $mod(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a % b
}}

exports.$add = $add
function $add(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a + b
}}

exports.$sub = $sub
function $sub(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a - b
}}

exports.$lt = $lt
function $lt(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a < b
}}

exports.$lte = $lte
function $lte(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a <= b
}}

exports.$gt = $gt
function $gt(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a > b
}}

exports.$gte = $gte
function $gte(a){ return function(b) {
  typeCheck('Number', a)
  typeCheck('Number', b)
  return a >= b
}}

exports.$matchesInterface = $matchesInterface
function $matchesInterface(a, bs) {
  return deepEqual(Object.keys(Object(a)).sort(), bs)
}

exports.$defMethod = $defMethod
function $defMethod(a, b, e) {
  if (typeof a === 'function')  a.prototype[b] = e
  else                          a[b] = e
}


exports.$data = function() {
  var i = adt.data.apply(null, arguments)
  i.prototype.clone    = function(self){ return Object.create(self) }
  i.prototype.$hasRepr = true
  return i
}

exports.raise = function(e) {
  throw e
}

exports.$any  = adt.any

exports.$curry = curry

exports.$node_require = require

exports.$require = $require
function $require(ext, std_path, rel_path) { return function(p) {
  if (/^std:/.test(p))         p = path.resolve(std_path, p.slice(4))
  else if (/^\.\//.test(p))    p = path.resolve(rel_path, p)
  if (path.extname(p) === '')  p += ext

  var file    = jsm.resolveFile(p, null)
  var dirname = path.dirname(file.filename)
  var module  = { exports: {} }
  var context = extend( file.state()
                      , { require: $require(ext, std_path, dirname)
                        , module:  module
                        , __dirname: path.dirname(file.filename) })

  vm.runInNewContext(file.code(), vm.createContext(context), file.filename)

  return module.exports
}}

var $List = exports.$List = adt.data({
  Nil: null,
  Cons: { head: adt.any
        , tail: exports.$List
        }
})
$List.prototype.$hasRepr = true

exports.Trampoline = adt.data({
  Done: { result: adt.any },
  More: { run: adt.only(Function) }
})

exports.trampoline = function(f) {
  var step = f()
  while (true) {
    if (step instanceof Trampoline.Done)       return step.result
    else if (step instanceof Trampoline.More)  step = step.run()
    else                                       throw new Error('Not a valid trampoline value: ' + show(step))
  }
}

exports.$extend = function(base, o) {
  return extendMut(Object.create(base), o)
}

exports.$console = console
exports.$process = process
