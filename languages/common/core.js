var curry     = require('core.lambda').curry
var escodegen = require('escodegen')

exports.parse = curry(2, parse)
function parse(parser, text) {
  return parser.matchAll(text, 'program')
}

exports.compile = curry(2, compile)
function compile(compiler, ast) {
  return compiler.match(ast, 'cc')
}

exports.generate = generate
function generate(ast) {
  return escodegen.generate(ast)
}
