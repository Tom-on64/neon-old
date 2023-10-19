# Neon Lang
---

## About
Neon is a Fast, All-purpose, Multiparadigm, Compiled programming language. 
Neon works by compiling into Neon Executables (.nex), which can be ran by the Neon runner on any machine.

## Current state
You can check on the current grammar [here](syntax/current.syn) (I'll try to keep updating it) \
Currently outputs the AST json data

## TODO
- [x] Define syntax (maybe ebnf?)
- [ ] Write base compiler in TypeScript V0.1.0
  - [ ] Tokenize
    - [x] Define tokens
    - [x] Peek(), Consume()
    - [x] Ignore Comments
    - [ ] Tokenize more complex project
  - [ ] Parse -> AST
    - [x] Define AST syntax
    - [ ] Statements
      - [x] Return
      - [x] Var Declare
      - [ ] Func Declare
      - [ ] If/else
        - [ ] Logic
      - [ ] Loops
        - [ ] For
        - [ ] While
    - [ ] Expressions
      - [x] Variable access
      - [ ] Func Calls
      - [ ] Logic expressions
        - [ ] Define what is True and False
        - [ ] And / Or / Not
      - [ ] Operations
        - [ ] Addition / Subtraction
        - [ ] Multiplication / Division
        - [ ] Exponentiatiation
        - [ ] Bitwise operations
        - [ ] More??
    - [ ] Pain
    - [ ] Parse more complex project
  - [ ] Traverse AST + Linker -> .nex
  - [ ] Runner
  - [x] Error handling
- [ ] Write full compiler in Neon V0.2.0
  - [ ] Translate/rewrite TS code
  - [ ] Compile using TS version
- [ ] Custom .nex (not compressed JSON) V0.3.0
- [ ] Optimization V0.4.0
- [ ] Optimization V0.5.0
- [ ] Optimization V0.6.0
- [ ] Optimization V0.7.0
- [ ] Optimization V0.8.0
- [ ] Optimization V0.9.0
- [ ] 1.0.0 Done!

