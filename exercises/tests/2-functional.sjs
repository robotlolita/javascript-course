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
var small  = function(x){ return claire.sized(function(){ return 10 }, x) }
var SList  = small(T.Array(T.Int))

function inc(a){ return a + 1 }
function toArray(xs) {
  return xs.isNada? [] : [xs.get(0)].concat(toArray(xs.get(1)))
}
function toList(xs) {
  return xs.reduceRight(function(ys, x){ return Lista.Celula(x, ys) }, Lista.Nada)
}

module.exports = spec('Functional', function(it, spec) {

  spec('(1) Catamorfismo', function(it) {
    it('Map', forAll(SList).satisfy(function(xs) {
                return !!(toArray(map(inc)(toList(xs))) => xs.map(inc))
              }).asTest())
  })

  spec('(2) Recursão', function(it) {
    it('Calc', function() {
      var Add = Math.Add, Sub = Math.Sub, Mul = Math.Mul, Num = Math.Num
      calc(Add(Num(1), Num(2))) => 1 + 2
      calc(Add(Sub(Num(3), Num(2)), Mul(Add(Num(3), Num(1)), Num(4)))) => (3 - 2) + (3 + 1) * 4
    })
  })

})
