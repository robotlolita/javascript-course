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

var fs        = require('fs')
var path      = require('path')
var sweetjs   = require('sweet.js')
var vm        = require('vm')
var jsm       = require('./core')

var modules = ['alright/macros', 'alright/macros/promises'].map(loadModule)


exports.run = run
function run(filename) {
  var exercise = jsm.resolveFile(filename)
  var test     = path.join( path.dirname(filename)
                          , 'test'
                          , path.basename(filename) + '.sjs')
  var options  = { filename      : test
                 , modules       : modules
                 , ast           : false
                 , readableNames : true }

  var code = exercise.code + '\n;\n' + sweetjs.compile(read(test), options).code
  return vm.runInNewContext(code, vm.createContext(exercise.state()), test)
}

function read(a) {
  return fs.readFileSync(a, 'utf-8')
}

function loadModule(a) {
  return sweetjs.loadNodeModule(path.resolve(__dirname, '../'), a)
}
