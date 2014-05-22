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

function Set(a) {
  return function(x){ return a === x }}

function Uniao(s1){ return function(s2){
  return function(x){ return s1(x) || s2(x) }}}

function Intersecao(s1){ return function(s2) {
  return function(x){ return s1(x) && s2(x) }}}

function Adiciona(s){ return function(x) {
  return Uniao(s, Set(x)) }}

function Contem(s){
  return function(x){ return s(x) }}


function Tuple(x, y) {
  return [x, y]
}

function f(x){ return Tuple(0, x) }
function g(x){ return Tuple(1, x) }
function h(x){ return function(y){ return Tuple(x, y) }}

module.exports = spec('Lambda Calculus', function(it, spec) {

  spec('(1) Funções de múltiplos parâmetros', function(it) {
    it('Soma', forAll(T.Num, T.Num).satisfy(function(a, b) {
                 return !!(soma(a)(b) => a + b)
               }).asTest())
    it('Entre X e Y', forAll(T.Num, T.Num, T.Num).satisfy(function(a, b, c) {
                        return !!(entreXeY(a)(b)(c) => c >= a && c <= b)
                      }).asTest())
  })

  spec('(2) Especialização parcial de uma função', function(it) {
    it('Multiplicação', forAll(T.Num).satisfy(function(a) {
                          return !!(multiplica(a) => a * 5)
                        }).asTest())
  })

  spec('(3) Combinadores', function(it) {
    it('Constante', forAll(T.Num, T.Num).satisfy(function(a, b) {
                      return !!(constante(a)(b) => a)
                    }).asTest())
  })

  spec('(4) Funções de alta-ordem', function(it) {
    it('Combina', forAll(T.Num).satisfy(function(a) {
                    return !!(combina(f)(g)(a) => f(g(a)))
                  }).asTest())
    it('Inverte', forAll(T.Num, T.Num).satisfy(function(a, b) {
                    return !!(inverte(h)(a)(b) => h(b)(a))
                  }).asTest())
  })

  spec('(5) Usando funçõesp ara modelar dados', function(it) {
    it('Contém', forAll(T.Num, T.Num).satisfy(function(x, y) {
                   return !!(
                     contem(Set(x))(x) => true,
                     contem(Set(x))(y) => x === y
                   )
                 }).asTest())
    it('União', forAll(T.Bool, T.Bool).satisfy(function(x, y) {
                  return !!(
                    uniao(Set(x))(Set(y))(x) => true,
                    uniao(Set(x))(Set(y))(y) => true
                  )
                }).asTest())
    it('Interseção', forAll(T.Bool, T.Bool).satisfy(function(x, y) {
                       return !!(
                         intersecao(Set(x))(Set(y))(x) => x === y
                       )
                     }).asTest())
    it('Adiciona', forAll(T.Num, T.Num).satisfy(function(x, y) {
                     return !!(
                       adiciona(Set(x))(y)(x) => true,
                       adiciona(Set(x))(y)(y) => true
                     )
                   }).asTest())
  })

})
