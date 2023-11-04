# Neon syntax

## Variables
Neon is a strongly typed language, so variables must have a type. \
You can define a variable in neon like this: `<type> <identifier> = <expression>;`

Example:
```neon
int x = 1 + 2 * 3;
```

## Comments
Neon supports single line and block comments. 
Anything inside comments will be ignored.

Single line comments are started with '//'.

Block comments are anything between '/\*' and '*/'

Example:
```neon
// This is a comment
int a = 1; // This is also a comment
/*
    This is 
    a block
    comment
*/
```

## Scopes
A scope is a codeblock enclosed by curly braces.
Variables defined in a scope are only accessible inside that scope.

Example:
```neon
int a = 1; // a is global
{ // A scope
    int b = 2; // b is only accessible inside this scope
    return a; // This is valid
    return b; // This is valid
}
return b; // This will throw an error
```

## If statements
In conditions, 0 is false and anything else is true.

Syntax: `if (<condition>) <scope>`

Example:
```neon
int x = 2;

if (x) {
    // some code
} else return 1;
```
