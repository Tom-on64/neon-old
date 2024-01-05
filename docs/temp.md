# Temporary notes

### Program structure
```nasm
_start: 
    jmp label1 
    mov rax, 0x02000001
    pop rdi
    syscall ; exit code

label1: ; int main()
    pop cx ; Return adress
    ; Declare all the argument variables
    push cx ; put return adress back
    ; ... (do some stuff)
    ; return the exit code
    pop ax ; return address
    ; Exit the scope
    push bx ; return value
    jmp ax
```

### Functions
Declaration ```nasm
; int add(int a, int b) {
;   return a+b;
; }
label1: ; int add(int a, int b)
    pop cx ; Return Adress
    ; genDecl(b)
    ; genDecl(a)
    push cx
    ; Function scope
    pop ax ; Return value
    pop cx ; Return address
    push ax
    jmp cx
```

Calling: ```nasm
; add(7, 9); // return the sum
; Assuming that add is at 'label1'
    ; eval arg1 and push it to the stack
    ; eval arg2 and push it to the stack
    push (rip + 16) ; return address after the jump
    jmp label1
    pop ax ; pops the return value into ax
```
