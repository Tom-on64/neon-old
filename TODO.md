## TODO
- [ ] Neon V0.1.0
  - [x] Define syntax 
  - [ ] Write base compiler in TypeScript 
    - [x] Tokenize (Somewhat)
      - [x] Define tokens
      - [x] Peek(), Consume()
      - [x] Ignore Comments
    - [ ] Parse -> AST
      - [x] Define AST syntax
      - [ ] Statements
        - [x] Return
        - [x] Var Declare
        - [x] Var Reassign
        - [ ] Func Declare
        - [x] If/else
          - [x] Condition expr
          - [x] Scopes
        - [ ] Loops
          - [ ] For
          - [x] While
      - [ ] Expressions
        - [x] Variables
        - [ ] Func Calls
        - [ ] Logic expressions
          - [x] Define what is True and False (1 - true; 0 - false)
          - [ ] Comparisons (<, >, ==, >=, <=, !=)
          - [ ] And / Or / Not / Xor?
        - [x] Operations (on integers)
          - [x] Addition / Subtraction
          - [x] Multiplication / Division
          - [x] Parenthesis
          - [x] Operator precidence
          - [x] Increment/decrement
          - [x] += and -=
      - [ ] Pain
    - [x] Generator
      - [x] Code -> asm
    - [x] Error handling
  - [ ] Write docs 
- [ ] Neon V0.2.0
  - [ ] More types
    - [ ] Bool
    - [ ] Signed/Unsigned Ints
    - [ ] Char
    - [ ] String (char* ??)
    - [ ] Floats
    - [ ] Void
    - [ ] Null
  - [ ] Exponentiatiation
- [ ] Neon V0.3.0
  - [ ] Importing
  - [ ] STD Lib 
    - [ ] Syscalls
    - [ ] Math (sqrt, sin, cos, etc.)
    - [ ] IO
- [ ] Neon V0.4.0
  - [ ] struct
  - [ ] enum
- [ ] Neon V0.5.0
  - [ ] Define .nex
    - [ ] Assemble into .nex
    - [ ] Link .nex
    - [ ] .nex runner
  - [ ] User defined types
  - [ ] More std lib stuff
- [ ] Neon V0.6.0
  - [ ] OOP features
    - [ ] class
      - [ ] modifiers
        - [ ] private
        - [ ] public
        - [ ] protected
        - [ ] more
- [ ] Neon V0.7.0
  - [ ] Optimization
  - [ ] Testing
  - [ ] Fixing
  - [ ] Optimization
  - [ ] Testing
  - [ ] Fixing
- [ ] Neon V0.8.0
  - [ ] Custom .nex (not compressed JSON)
- [ ] Neon V0.9.0
  - [ ] Write full compiler in Neon 
    - [ ] Translate/rewrite TS code
    - [ ] Compile using TS version
- [ ] Neon V1.0.0!
  - [ ] Compile Neon into an executable
    - [ ] Windows
    - [ ] MacOS
    - [ ] Linux
  - [ ] Compile libs
  - [ ] Release
  - [ ] Add to package managers
  - [ ] Release the Neon extension
- And more...
