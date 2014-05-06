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
<letter>     ::= a | b | c | ... | z | A | B | C | ... | Z
<digit>      ::= 0 | 1 | 2 | ... | 9
<identifier> ::= <letter> (<letter> | <digit> | _)+
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

Por essas regras podemos saber quais construções são válidas segundo a sintaxe
da linguagem. Como os símbolos podem ser combinados, e em que contextos esses
símbolos podem ser utilizados. Mas nada nessas regras nos diz qual o
significado dessas combinações de símbolos e construções.
