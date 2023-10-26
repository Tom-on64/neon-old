import { error } from "./error.ts";

export class Lexer {
    private index = 0;
    private input = [""];

    private consume(amount = 1): string {
        this.index += amount;
        if (this.index > this.input.length) error(10);
        return this.input[this.index - amount];
    }

    private peek(amount = 1): string {
        return this.input[this.index + amount];
    }

    private current(): string {
        if (this.index >= this.input.length) error(10);
        return this.input[this.index];
    }

    private parseString(): IToken {
        const quote = this.consume(); // First quote
        let string = "";

        if (quote == '"') {
            while (this.current() != quote) string += this.consume();
            this.consume(); // Consume end quote

            return { type: Literal.STRING, value: string, _type: "token" };
        } else {
            const char = this.consume();
            if (this.current() != quote) error(1);
            this.consume(); // Consume the other quote
            return { type: Literal.CHAR, value: char, _type: "token" };
        }
    }

    private parseNumber(): IToken {
        let numString = this.consume();

        while (this.current().match(/[0-9]/)) numString += this.consume();

        if (this.current() != "." && this.current() != "f")
            return { type: Literal.INT, value: parseInt(numString), _type: "token" };
        else if (this.current() == "f") {
            this.consume();
            return { type: Literal.FLOAT, value: parseFloat(numString), _type: "token" };
        }

        numString += this.consume(); // Consume period
        while (this.current().match(/[0-9]/)) numString += this.consume();
        if (this.current() != "f") error(2);
        this.consume() // Consume 'f'

        return { type: Literal.FLOAT, value: parseFloat(numString), _type: "token" };
    }

    tokenize(file: string): IToken[] {
        this.index = 0;
        // Prepare file
        this.input = file
            .replaceAll(/(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*$)/gm, "") // Remove all Comments
            .replaceAll(/(\s\s+|\n)/g, "") // Remove whitespace
            .split(""); // Split into single characters

        const tokens: IToken[] = [];

        while (this.index < this.input.length) {
            if (this.current().match(/\s/)) this.consume(); // Ignore Whitespace
            else if (this.current().match(/[A-Za-z_]/)) {
                // Get an identifier
                let identifier = this.consume();
                while (this.current().match(/[A-Za-z0-9_]/)) identifier += this.consume();
                const token: IToken = { type: TokenType.IDENTIFIER, value: identifier, _type: "token" };

                // Check if it's a keyword or a type
                if (identifier === "return") token.type = TokenType.RETURN;
                else if (identifier === "if") token.type = TokenType.IF;
                else if (identifier === "else") token.type = TokenType.ELSE;
                else if (identifier === "while") token.type = TokenType.WHILE;
                else if (identifier === "null") token.type = TokenType.NULL;
                else if (types.includes(identifier)) token.type = TokenType.TYPE;
                tokens.push(token);
            } else if (this.current().match(/[0-9'"]/)) {
                // Check for literals
                if (this.current().match(/('|")/)) tokens.push(this.parseString()); // String
                else tokens.push(this.parseNumber()); // Number
            } else if (this.current() === "=") {
                tokens.push({ type: TokenType.EQUALS, _type: "token" });
                this.consume();
            } else if (this.current() === ";") {
                tokens.push({ type: TokenType.EOL, _type: "token" });
                this.consume();
            } else if (this.current() === "+") {
                if (this.peek() === "+") {
                    tokens.push({ type: TokenType.DPLUS, _type: "token" })
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.PLUS, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "-") {
                if (this.peek() === "-") {
                    tokens.push({ type: TokenType.DMINUS, _type: "token" })
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.MINUS, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "*") {
                if (this.peek() === "*") {
                    tokens.push({ type: TokenType.DSTAR, _type: "token" })
                    this.consume(2);
                } else {
                    tokens.push({ type: TokenType.STAR, _type: "token" });
                    this.consume();
                }
            } else if (this.current() === "/") {
                tokens.push({ type: TokenType.FSLASH, _type: "token" });
                this.consume();
            } else if (this.current() === "(") {
                tokens.push({ type: TokenType.OPENPAREN, _type: "token" });
                this.consume();
            } else if (this.current() === ")") {
                tokens.push({ type: TokenType.CLOSEPAREN, _type: "token" });
                this.consume();
            } else if (this.current() === "{") {
                tokens.push({ type: TokenType.OPENCURLY, _type: "token" });
                this.consume();
            } else if (this.current() === "}") {
                tokens.push({ type: TokenType.CLOSECURLY, _type: "token" });
                this.consume();
            } else error(3, [this.consume()]);
        }
        tokens.push({ type: TokenType.EOF, _type: "token" })

        return tokens;
    }
}

export enum TokenType {
    IDENTIFIER = "identifier",
    // Keywords
    RETURN = "return",
    IF = "if",
    ELSE = "else",
    WHILE = "while",
    NULL = "null",
    // Special chars
    EQUALS = "equals",
    PLUS = "plus",
    DPLUS = "dplus",
    MINUS = "minus",
    DMINUS = "dminus",
    STAR = "star",
    DSTAR = "dstar",
    FSLASH = "slash",
    OPENPAREN = "openparen",
    CLOSEPAREN = "closeparen",
    OPENCURLY = "opencurly",
    CLOSECURLY = "closecurly",
    // Other
    TYPE = "type",
    EOL = "EOL",
    EOF = "EOF",
}

export enum Literal {
    INT = "LInt",
    FLOAT = "LFloat",
    CHAR = "LChar",
    STRING = "LString",
}

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

export interface IToken {
    _type: "token";
    type: TokenType | Literal;
    value?: string | number | boolean;
}

export const NULL: IToken = { type: TokenType.NULL, _type: "token" };

export const getBinPrec = (binOp: TokenType | Literal): number | null => {
    switch (binOp) {
        case TokenType.STAR:
        case TokenType.FSLASH: return 1;
        case TokenType.PLUS:
        case TokenType.MINUS: return 0;
        default: return null;
    }
}
