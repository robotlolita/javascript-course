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

var show            = require('util').inspect
var internalClassOf = Function.call.bind({}.toString)

function classOf(a) {
  return internalClassOf(a).slice(8, -1)
}

function typeCheck(expected, actual) {
  if (classOf(actual) !== expected)
    throw new TypeError('Expected a value of type ' + expected
                       + ', got ' + classOf(actual) + ': ' + show(actual))
}

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
