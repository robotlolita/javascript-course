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

var fs      = require('fs')
var path    = require('path')
var vm      = require('vm')
var sweetjs = require('sweet.js')
var extend  = require('xtend')
var hifive  = require('hifive')
var spec    = require('hifive-spec')
var alright = require('alright')
var colour  = require('chalk')
var jsm     = require('./core')

var fading     = colour.gray
var divergence = alright.divergence.invertibleDivergence
var modules    = ['alright/macros', 'alright/macros/promises'].map(loadModule)


exports.run = run
function run(filename, printCompiled) {
  var exercise = jsm.resolveFileUsing(jsm.parseTest, filename, null)
  var ext      = path.extname(filename)
  var test     = path.join( path.dirname(filename)
                          , 'tests'
                          , path.basename(filename, ext) + '.sjs')
  var options  = { filename      : test
                 , modules       : modules
                 , ast           : false
                 , readableNames : true }

  var code    = exercise.code() + '\n;\n' + sweetjs.compile(read(test), options).code
  var context = makeContext(exercise.state(), test)

  if (printCompiled)  console.log(fading(code), '\n')
  vm.runInNewContext(code, context, filename)
  return hifive.run([context.module.exports], spec())
}

function makeContext(state, file) {
  var root = path.dirname(file)
  var req  = function(p){ return /^\./.test(p)?   require(path.join(root, p))
                        :        /* otherwise */  require(p) }

  var context = extend(state, { require:   req
                              , __dirname: root
                              , $equiv:    equivalent
                              , module:    { exports: {} }})
  return vm.createContext(context)
}

function read(a) {
  return fs.readFileSync(a, 'utf-8')
}

function loadModule(a) {
  return sweetjs.loadNodeModule(path.resolve(__dirname, '../'), a)
}

function equivalent(a, b, expression) {
  return Boolean(alright.verify(b, isEquivalent))

  function isEquivalent(x) {
    return alright.assert( equals(a, x)
                         , divergence( '{:expr} to hold.'
                                     , '{:expr} not to hold.'
                                     ).make({ expr: expression }))}
}

function equals(a, b) {
  return hasEq(a) && hasEq(b)?  a.isEqual(b)
  :      /* otherwise */        a === b
}

function hasEq(a) {
  return 'isEqual' in Object(a)
}