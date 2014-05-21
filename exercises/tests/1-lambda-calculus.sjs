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

var spec    = require('hifive')()
var alright = require('alright')
var claire  = require('claire')

var forAll = claire.forAll
var T      = claire.data

function Tuple(x, y) {
  return { 0: x, 1: y
         , isEqual: function(a) { return a.x === this.x && a.y === this.y }}
}

function _compose(f, g, x){ return f(g(x)) }
function _flip(f, x, y){ return f(y)(x) }
function f(x){ return Tuple(0, x) }
function g(x){ return Tuple(1, x) }
function h(x, y){ return Tuple(x, y) }

module.exports = spec('Lambda Calculus', function(it, spec) {

  spec('(1) Funções de múltiplos parâmetros', function(it) {
    it('Soma', forAll(T.Num, T.Num).satisfy(prop_soma).asTest())
    it('Entre X e Y', forAll(T.Num, T.Num, T.Num).satisfy(prop_entreXeY).asTest())
  })

  spec('(2) Especialização parcial de uma função', function(it) {
    it('Multiplicação', forAll(T.Num).satisfy(prop_multiplica).asTest())
  })

  spec('(3) Combinadores', function(it) {
    it('Constante', forAll(T.Any, T.Any).satisfy(prop_constante).asTest())
  })

  spec('(4) Funções de alta-ordem', function(it) {
    it('Combina', forAll(T.Any).satisfy(prop_combina.bind(null, f, g)).asTest())
    it('Inverte', forAll(T.Any, T.Any).satisfy(prop_inverte.bind(null, h)).asTest())
  })

})
