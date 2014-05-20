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

var read      = require('fs').readFileSync
var path      = require('path')
var readline  = require('readline')
var vm        = require('vm')
var curry     = require('core.lambda').curry
var escodegen = require('escodegen')
var languages = require('./languages')


exports.parseUsing = curry(3, parseUsing)
function parseUsing(rule, parser, text) {
  return parser.matchAll(text, rule)
}

exports.parse     = exports.parseUsing('program')
exports.parseExpr = exports.parseUsing('expr')
exports.parseTest = exports.parseUsing('testProgram')

exports.compile = curry(2, compile)
function compile(compiler, ast) {
  return compiler.match(ast, 'cc')
}

exports.generate = generate
function generate(ast) {
  return escodegen.generate(ast)
}

exports.resolveFileUsing = curry(3, resolveFileUsing)
function resolveFileUsing(parse, file, language) {
  var lang = language || languages[path.extname(file).slice(1)]
  if (!lang)  throw new Error('Unregistered language for ' + file)

  var ast   = function(){ return parse(lang.Parser, read(file, 'utf-8')) }
  var jsAst = function(){ return compile(lang.Compiler, ast()) }

  return { filename : file
         , state    : lang.state
         , code     : function(){ return generate(jsAst()) }
         , jsAst    : jsAst
         , ast      : ast
         }
}

exports.resolveFile = exports.resolveFileUsing(exports.parse)

exports.repl = curry(2, repl)
function repl(language, state) {
  console.log('Using the language: ' + language.name)
  console.log('Type :quit to exit (or ^D)')
  console.log('')
  loopEvaluation( language
                , vm.createContext(state)
                , readline.createInterface({ input: process.stdin
                                           , output: process.stdout }))
}

function loopEvaluation(language, state, rl) {
  rl.question(language.name + '> ', function(program) {
    evaluateCommand(language, state, program)
    loopEvaluation(language, state, rl)
  })
}

function evaluateCommand(language, state, program) {
  return program === ':quit'?  process.exit(0)
  :      /* otherwise */       console.log(run(language, state, program))
}

function run(language, state, program) {
  var ast  = exports.parseExpr(language.Parser, program)
  var code = generate(compile(language.Compiler, ast))

  try {
    return vm.runInNewContext(code, state, '<repl>')
  } catch(e) {
    console.log(e.stack)
  }
}