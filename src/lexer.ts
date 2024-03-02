import { error } from "./error.js";

export class Lexer {
    private index = 0;
    private lineNum = 0;
    private input = [""];

    private consume(amount = 1): string {
        this.index += amount;
        if (this.index > this.input.length) error(104, [], this.lineNum);
        return this.input[this.index - amount];
    }

    private peek(amount = 1): string {
        return this.input[this.index + amount];
    }

    private current(): string {
        if (this.index >= this.input.length) error(104, [], this.lineNum);
        return this.input[this.index];
    }

    private parseString(): IToken {
        const quote = this.consume(); // First quote
        let string = "";

        if (quote == '"') {
            while (this.current() != quote) string += this.consume();
            this.consume(); // Consume end quote

            return { type: Literal.STRING, value: string, lineNum: this.lineNum, _type: "token" };
        } else {
            const char = this.consume();
            if (this.current() != quote) error(101, [], this.lineNum);
            this.consume(); // Consume the other quote
            return { type: Literal.CHAR, value: char, lineNum: this.lineNum, _type: "token" };
        }
    }

    private parseNumber(): IToken {
        let numString = this.consume();

        while (this.current().match(/[0-9]/)) numString += this.consume();

        if (this.current() != "." && this.current() != "f")
            return { type: Literal.INT, value: parseInt(numString), lineNum: this.lineNum, _type: "token" };
        else if (this.current() == "f") {
            this.consume();
            return { type: Literal.FLOAT, value: parseFloat(numString), lineNum: this.lineNum, _type: "token" };
        }

        numString += this.consume(); // Consume period
        while (this.current().match(/[0-9]/)) numString += this.consume();
        if (this.current() != "f") error(102, [], this.lineNum);
        this.consume() // Consume 'f'

        return { type: Literal.FLOAT, value: parseFloat(numString), lineNum: this.lineNum, _type: "token" };
    }

    tokenize(file: string): IToken[] {
        this.index = 0;
        // Prepare file
        this.input = file.split(""); // Split into single characters

        const tokens: IToken[] = [];

        while (this.index < this.input.length) {
            if (this.current() === "/" && this.peek() === "/") { // Single line comments
                while (this.current() !== "\n") this.consume();
            } else if (this.current() === "/" && this.peek() === "*")  { // Multi line comments
                while (this.current() !== "*" || this.peek(1) !== "/") this.consume();
                this.consume(); // Consume the '*'
                this.consume(); // Consume the '/'
            } else if (this.current().match(/[A-Za-z_]/)) {
                // Get an identifier
                let identifier = this.consume();
                while (this.current().match(/[A-Za-z0-9_]/)) identifier += this.consume();
                const token: IToken = { type: TokenType.IDENTIFIER, value: identifier, lineNum: this.lineNum, _type: "token" };

                // Check if it's a keyword or a type
                if (identifier === "return") token.type = TokenType.RETURN;
                else if (identifier === "if") token.type = TokenType.IF;
                else if (identifier === "else") token.type = TokenType.ELSE;
                else if (identifier === "while") token.type = TokenType.WHILE;
                else if (identifier === "null") token.type = TokenType.NULL;
                else if (identifier === "true") token.type = TokenType.TRUE;
                else if (identifier === "false") token.type = TokenType.FALSE;
                else if (types.includes(identifier)) token.type = TokenType.TYPE;
                tokens.push(token);
            } else if (this.current().match(/[0-9'"]/)) {
                // Check for literals
                if (this.current().match(/('|")/)) tokens.push(this.parseString()); // String
                else tokens.push(this.parseNumber()); // Number
            } else if (this.current() === "=") {
                if (this.peek() === "=") {
                    tokens.push({ type: TokenType.DEQUALS, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.EQUALS, lineNum: this.lineNum, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === ";") {
                tokens.push({ type: TokenType.EOL, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === "+") {
                if (this.peek() === "+") {
                    tokens.push({ type: TokenType.DPLUS, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else if (this.peek() === "=") {
                    tokens.push({ type: TokenType.PEQUALS, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.PLUS, lineNum: this.lineNum, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "-") {
                if (this.peek() === "-") {
                    tokens.push({ type: TokenType.DMINUS, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else if (this.peek() === "=") {
                    tokens.push({ type: TokenType.MEQUALS, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.MINUS, lineNum: this.lineNum, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "*") {
                if (this.peek() === "*") {
                    tokens.push({ type: TokenType.DSTAR, lineNum: this.lineNum, _type: "token" });
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.STAR, lineNum: this.lineNum, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "/") {
                tokens.push({ type: TokenType.FSLASH, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === "(") {
                tokens.push({ type: TokenType.OPENPAREN, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === ")") {
                tokens.push({ type: TokenType.CLOSEPAREN, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === "{") {
                tokens.push({ type: TokenType.OPENCURLY, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === "}") {
                tokens.push({ type: TokenType.CLOSECURLY, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === ",") {
                tokens.push({ type: TokenType.COMMA, lineNum: this.lineNum, _type: "token" });
                this.consume();
            } else if (this.current() === "\n") {
                this.consume();
                this.lineNum++;
            } else if (this.current().match(/\s/)) this.consume(); // Ignore Whitespace
            else error(103, [this.consume()], this.lineNum);
        }
        tokens.push({ type: TokenType.EOF, lineNum: this.lineNum, _type: "token" })

        return tokens;
    }
}

export enum TokenType {
    IDENTIFIER = "ident",
    TYPE = "type",
    // Keywords
    RETURN = "return",
    IF = "if",
    ELSE = "else",
    WHILE = "while",
    NULL = "null",
    TRUE = "true",
    FALSE = "false",
    // Special chars
    EQUALS = "=",
    DEQUALS = "==",
    PEQUALS = "+=",
    MEQUALS = "-=",
    PLUS = "+",
    DPLUS = "++",
    MINUS = "-",
    DMINUS = "--",
    STAR = "*",
    DSTAR = "**",
    FSLASH = "/",
    BSLASH = "\\",
    OPENPAREN = "(",
    CLOSEPAREN = ")",
    OPENCURLY = "{",
    CLOSECURLY = "}",
    COMMA = ",", 
    // Control
    EOL = ";",
    EOF = "End of file",
}

export enum Literal {
    INT = "LInt",
    FLOAT = "LFloat",
    CHAR = "LChar",
    STRING = "LString",
}

const types = [
    "void",     // Absence of type
    "char",     // 8-bit character (ASCII number)
    "int",      // Signed integer
    "uint",     // Unsigned integer
    "float",    // Floating point number
    "bool",     // Boolean
    "string",   // String of characters (char*?)
    "object",   // Object/Hashmap/Dictionary
    "null",     // Null
]

export interface IToken {
    type: TokenType | Literal;
    value?: string | number | boolean;
    lineNum?: number;
    _type: "token";
}

export const NULL: IToken = { type: TokenType.NULL, _type: "token" };

export const getBinPrec = (binOp: TokenType | Literal): number | null => {
    switch (binOp) {
        case TokenType.DSTAR: return 2;
        case TokenType.STAR:
        case TokenType.FSLASH: return 1;
        case TokenType.PLUS:
        case TokenType.MINUS: return 0;
        default: return null;
    }
}
