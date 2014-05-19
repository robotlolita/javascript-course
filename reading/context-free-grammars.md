Context-Free Grammars
=====================

Uma linguagem é formada de sintaxe e semântica. A sintaxe define quais símbolos
são válidos na linguagem, e como esses símbolos podem ser combinados, enquanto
a semântica define o que cada combinação de símbolos significa. Sintaxes são
formalizadas através de uma gramática, e **Context-Free Grammars** (CFG) são
uma das formas de especificação.

Linguagens, tanto naturais (Inglês, Português, ...) quanto linguagens de
programação (JavaScript, C#, ...) são estudadas pela área de linguística, e
categorizadas em uma hierarquia chamada *hierarquia de Chomsky*.

![Hierarquia de Chomsky]()

Grande parte das linguagens de programação (e todas que importam nesse
workshop) pertencem à classe de linguagens livres de contexto (CFG). Essas
linguagens podem ser descritas por quatro aspectos:

  - Um conjunto finito de *terminais* utilizados para construir
    sentenças. Esses são os "símbolos," ou "alfabeto" da linguagem em
    questão. Um *terminal* é inteiramente definido por si só, ao invés de ser
    definido pela combinação de outros símbolos.

    Em linguagens de programação, palavras-chave, como **if**, **function**,
    etc. são considerados terminais.

  - Um conjunto finito de variáveis *não-terminais*, utilizadas para
    construir "frases," ou "cláusulas" diferentes em uma
    sentença. *Não-terminais* são o resultado da combinação de outras
    construções da linguagem (terminais ou não).

    Em linguagens de programação, uma expressão do tipo adição é considerada
    um não-terminal, pois é uma combinação de diferentes "símbolos."

  - Uma série (finita) de descrições relacionando uma variável com uma ou mais
    construções da linguagem (terminais ou não). Geralmente chamados de
    *regras* da linguagem. Básicamente governam como cada símbolo pode ser
    combinado para formar as variáveis.

    Em linguagens de programação, uma regra que define que a combinação `a + b`
    é uma adição seria um exemplo desse conceito. 

  - A construção inicial da linguagem (terminal ou não), utilizada para
    construir um programa inteiro.

Okay, mas o que essas definições significam na prática? Bem, considere como
exemplo uma linguagem aritimética simples. Os terminais nessa linguagem (os
símbolos fundamentais) seriam algo como números e os símbolos representando
operações como adição ou subtração:

```hs
Alfabeto = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, +, - }
```

De forma similar, podemos pensar em combinações usando esses símbolos, e nomear
essas combinações:

```hs
Combinações = { número, adição, subtração, agrupamento, ... }
```

Mas só esses dois conjuntos por si não são muito interessantes. A parte
realmente interessante é como esses símbolos podem ser combinados. Existe uma
notação popular para descrever essas combinações chamada
[Backus-Naur Form][BNF] (BNF). Se a utilizarmos para descrever as regras dessa
linguagem aritimética teríamos algo assim:

```hs
<Dígito>      = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
<Número>      = <Dígito> <Número>
              | <Dígito>
<Agrupamento> = ( <Expressão> )
<Adição>      = <Expressão> + <Expressão>
<Subtração>   = <Expressão> - <Expressão>
<Expressão>   = <Agrupamento>
              | <Adição>
              | <Subtração>
              | <Número>
```

Nessa linguagem, regras são definidas no formato `<Variável> = E₁ E₂ E₃
... Eₙ`, aonde `E` é uma construção (terminal ou não) da linguagem, ou uma
alternativa entre duas construções, denotada por `E₁ | E₂`. No caso de
alternativas, qualquer uma das cláusulas é uma combinação válida para a
variável, e a resolução dessas escolhas fica a cargo da linguagem.

Uma das partes interessantes de gramáticas formais é que podemos ver
rápidamente quais construções são válidas na linguagem. Olhando a definição
acima podemos inferir que: `0` é um `<Número>` válido, mas `000` e `0123210`
também são números válidos.

A gramática também diz que, enquanto `(1 + 2)` é uma expressão válida, `(1 +-
2)` não é, nem `(1 +)` ou `(+ 1)`. `<Adição>` e `<Subtração>` sempre esperam
uma expressão válida dos dois lados.

Gramáticas formais de linguagens de programação são úteis para escrever
programas que possam entender a estrutura da linguagem e manipulá-la (parsers,
interpretadores, compiladores, ...), bem como para estudar a sintaxe de uma
linguagem.


[BNF]: http://en.wikipedia.org/wiki/Backus%E2%80%93Naur_Form
