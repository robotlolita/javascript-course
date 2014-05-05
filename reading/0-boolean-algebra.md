Lógica Booleana
===============

A área de computação é extremamente influenciada pela matemática (especialmente
a lógica matemática). Uma das sub-áreas da lógica mais simples, mas que pode
ser percebida diretamente em computação, é a lógica booleana.

Nesse modelo computacional uma álgebra é formada pelos valores *Verdadeiro* e
*Falso*, e no qual as operações principais sobre esses valores são a
**Conjunção** (∧), **Disjunção** (∨), e **Negação** (¬).

As regras para essa linguagem podem ser definidas da seguinte forma:

```hs
<identifier> ::= <letter> (<letter> | <digit>)+
<value>      ::= true | false
<expr>       ::= ( <expr> )                     -- Agrupamento
               | <expr> ? <expr> : <expr>       -- Condicional
               | <expr> && <expr>               -- Conjunção
               | <expr> || <expr>               -- Disjunção
               | ! <expr>                       -- Negação
               | <identifier>
               | <value>
<stmt>       ::= let <identifier> = <expr>      -- Binding
```
