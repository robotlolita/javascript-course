var readline  = require('readline')
var vm        = require('vm')
var curry     = require('core.lambda').curry
var escodegen = require('escodegen')


exports.parse = curry(2, parse)
function parse(parser, text) {
  return parser.matchAll(text, 'program')
}

exports.parseExpr = curry(2, parseExpr)
function parseExpr(parser, text) {
  return parser.matchAll(text, 'expr')
}

exports.compile = curry(2, compile)
function compile(compiler, ast) {
  return compiler.match(ast, 'cc')
}

exports.generate = generate
function generate(ast) {
  return escodegen.generate(ast)
}

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
  var ast  = parseExpr(language.Parser, program)
  var code = generate(compile(language.Compiler, ast))

  try {
    return vm.runInNewContext(code, state, '<repl>')
  } catch(e) {
    console.log(e.stack)
  }
}