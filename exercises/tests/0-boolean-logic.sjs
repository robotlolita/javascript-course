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

module.exports = spec('Boolean Logic', function(it, spec) {

  it('(1) Identidade', function() {
    identity_disjunctionA() => true
    identity_disjunctionB() => false

    identity_conjunctionA() => true
    identity_conjunctionB() => false
  })

  it('(2) Aniquilação', function() {
    annihilator_conjunctionA() => true
    annihilator_conjunctionB() => true

    annihilator_disjunctionA() => false
    annihilator_disjunctionB() => false
  })

  it('(3) Complementação', function() {
    complementation_false() => false
    complementation_true()  => true
  })

  it('(4) Derivando negação do operador condicional', function() {
    negation1() => false
    negation2() => true
  })
  
})
