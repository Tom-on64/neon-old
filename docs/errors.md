# Errors

Here's a list of all errors in Neon:

### General System Errors
| Code | Message       |
| ---- | ------------- |
| 000  | Unknown Error |

### Lexer Errors
| Code | Message                                 |
| ---- | --------------------------------------- |
| 100  | Lexer Error                             |
| 101  | Expected single character, but got more |
| 102  | Expected 'f' after float literal        |
| 103  | Invalid character '%0'                  |
| 104  | Unexpected End of file                  |

### Parser Errors
| Code | Message                        |
| ---- | ------------------------------ |
| 200  | Parsing Error                  |
| 201  | Unable to parse expression     |
| 202  | Expected %0                    |
| 203  | Peek out of range              |
| 204  | Expected statement, but got %0 |
| 205  | Unknown operator               |
| 206  | Expected expression            |

### Generator Errors
| Code | Message                           |
| ---- | --------------------------------- |
| 300  | Generation Error                  |
| 301  | Undeclared identifier '%1'        |
| 302  | Assignment to undeclared variable |
| 303  | Variable already exists           |
| 304  | Generation Error                  |

### Other Errors
| Code | Message                                                                  |
| ---- | ------------------------------------------------------------------------ |
| 500  | Fatal Error                                                              |
| 501  | You must begin a scope before closing it!                                |
| 502  | No input file provided!                                                  |
| 503  | Expected a file path                                                     |
| 504  | Unknown option. Use 'neon --help' for a list of available options |

_Note: percent sign prefixed numbers are variables_