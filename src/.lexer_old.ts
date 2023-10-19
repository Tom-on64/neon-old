import { error } from "./error.ts";

export class Lexer {
    private index = 0;
    private input = [""];

    private consume(amount = 1): string {
        const old = this.input[this.index];
        this.index += amount;
        return old;
    }

    private peek(amount = 1): string {
        return this.input[this.index + amount];
    }

    private current(): string {
        return this.input[this.index];
    }

    private parseString(): Token {
        const quote = this.consume(); // First quote
        let string = "";

        if (quote == '"') {
            while (this.current() != quote) string += this.consume();
            this.consume();

            return new Token(Literal.STRING, string);
        } else {
            const char = this.consume();
            if (this.current() != quote) error(1);
            this.consume(); // Consume the other quote
            return new Token(Literal.CHAR, char);
        }
    }

    private parseNumber(): Token {
        let numString = this.consume();

        while (this.current().match(/[0-9]/)) numString += this.consume();

        if (this.current() != "." && this.current() != "f") 
            return new Token(Literal.INT, parseInt(numString));
        else if (this.current() == "f") {
            this.consume();
            return new Token(Literal.FLOAT, parseFloat(numString));
        } 

        numString += this.consume(); // Consume period
        while (this.current().match(/[0-9]/)) numString += this.consume();
        if (this.current() != "f") error(2);
        this.consume() // Consume 'f'
        
        return new Token(Literal.FLOAT, parseFloat(numString));
    }

    tokenize(file: string): Token[] {
        this.index = 0;
        // Prepare file
        this.input = file
        .replaceAll(/(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*$)/gm, "") // Remove all Comments
        .replaceAll(/(\s\s+|\n)/g, "") // Remove whitespace
        .split(""); // Split into single characters
        const tokens = Array<Token>();

        // Generate the tokens
        while (this.index < this.input.length) {
            if (this.current().match(/[A-Za-z_]/)) {
                // Get an identifier
                let identifier = this.consume();
                while (this.current().match(/[A-Za-z0-9_]/)) identifier += this.consume();

                // Check if it's a keyword or a type, else it's an id
                if (keywords.includes(identifier)) tokens.push(new Token(TokenType.KEYWORD, identifier));
                else if (types.includes(identifier)) tokens.push(new Token(TokenType.TYPE, identifier));
                else tokens.push(new Token(TokenType.IDENTIFIER, identifier));
            } else if (this.current().match(/[0-9'"]/)) {
                // Check for literals
                if (this.current().match(/('|")/)) tokens.push(this.parseString()); // String
                else tokens.push(this.parseNumber()); // Number
            } else if (operators.includes(this.current())) // Check for operators
                tokens.push(new Token(TokenType.OPERATOR, this.consume()));
            else if (special.includes(this.current())) // Check for special symbols
                tokens.push(new Token(TokenType.SPECIAL, this.consume()));
            else if (this.current() == ";") { this.consume(); tokens.push(new Token(TokenType.EOL)) }
            else this.consume();
        }
        tokens.push(new Token(TokenType.EOF));


        return tokens;
    }
}

export class Token {
    type: TokenType | Literal;
    value: string | number | undefined;
    constructor(type: TokenType | Literal, value?: string | number) {
        this.type = type;
        this.value = value;
    }
}

export enum TokenType {
    KEYWORD = "keyword", 
    TYPE = "type", 
    SPECIAL = "special", 
    OPERATOR = "operator", 
    IDENTIFIER = "identifier", 
    EOF = "EOF", 
    EOL = "EOL"
}

export enum Literal {
    STRING = "LString", 
    CHAR = "LChar", 
    INT = "LInt", 
    FLOAT = "LFloat"
}

const keywords = [
    "if",
    "else",
    "while",
    "for",
    "return",
    "break",
    "continue",
    "import",
    ":",
]

const types = [
    "void",
    "byte",
    "sbyte",
    "short",
    "ushort",
    "int",
    "uint",
    "long",
    "ulong",
    "float",
    "double",
    "char",
    "bool",
    "string",
    "object",
    "null",
]

const special = [".", ",", "(", ")", "[", "]", "{", "}", "@", "#"]

const operators = ["=", "+", "-", "*", "/", ">", "<", "!", "&", "|", "^"]

/*
enum Type {
    VOID = "void",
    BYTE = "byte",
    SBYTE = "sbyte",
    SHORT = "short",
    USHORT = "ushort",
    INT = "int",
    UINT = "uint",
    LONG = "long",
    ULONG = "ulong",
    FLOAT = "float",
    DOUBLE = "double",
    CHAR = "char",
    BOOL = "bool",
    STRING = "string",
    OBJECT = "object",
    NULL = "null",
}
*/
