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
var brushtail = require('brushtail')
var curry     = require('core.lambda').curry
var escodegen = require('escodegen')
var colour    = require('chalk')
var extend    = require('xtend')
var inspect   = require('util').inspect
var languages = require('./languages')
var _         = require('./gen')

var faded  = colour.gray
var error  = colour.red
var result = colour.cyan

function show(a) {
  return a && a.$hasRepr?  a.toString()
  :                        inspect(a)
}

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
  return brushtail.tco(escodegen.generate(ast))
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

exports.repl = curry(3, repl)
function repl(language, state, printCompiled) {
  console.log('Using the language: ' + language.name)
  console.log('Type :quit to exit (or ^D), :load <file> to load code')
  console.log('')
  loopEvaluation( language
                , vm.createContext(state)
                , readline.createInterface({ input: process.stdin
                                           , output: process.stdout })
                , printCompiled )
}

function loopEvaluation(language, state, rl, print) {
  rl.question(language.name + '> ', function(program) {
    finishReplLoop(language, state, rl, print, program)
  })
}

function continueRepl(language, state, rl, print, acc) {
  rl.question('... ', function(program) {
    finishReplLoop(language, state, rl, print, acc + '\n' + program)
  })
}

function finishReplLoop(language, state, rl, print, program) {
  if (/\b_$/.test(program.trim()))
    return continueRepl(language, state, rl, print, program.slice(0, -1))

  evaluateCommand(language, state, program, print)
  loopEvaluation(language, state, rl, print)
}

function evaluateCommand(language, state, program, print) {
  return program === ':quit'?           process.exit(0)
  :      /^:load\s+\S+/.test(program)?  maybeLog(load(language, state, program, print))
  :      /* otherwise */                maybeLog(run(language, state, program, print))
}

function maybeLog(a) {
  if (a !== undefined)  console.log(faded('=>'), result(show(a)))
}

function load(language, state, program, print) {
  var file = (program.match(/^:load\s+(.+)/) || [])[1]
  return run(language, state, read(file, 'utf-8'), print)
}

function run(language, state, program, print) {
  if (!(program || '').trim())  return

  try {
    var ast      = exports.parse(language.Parser, program)
    var compiled = compile(language.Compiler, ast)
    var code     = generate(compiled)
  } catch(e) {
    console.log(error(e))
    if (print)  console.log(faded(e.stack.split('\n').slice(1).join('\n')))
    if (print)  console.log(faded(JSON.stringify(compiled, null, 2)))
  }

  return runProgram(code, state, '<repl>', print)
}

exports.runProgram = curry(4, runProgram)
function runProgram(program, state, filename, print) {
  try {
    if (print)  console.log(faded(program))
    return vm.runInNewContext(program, state, filename)
  } catch(e) {
    console.log(error(e))
  }
}