import { error } from "./error.ts";

export class Lexer {
    private index = 0;
    private input = [""];

    private consume(amount = 1): string {
        this.index += amount;
        return this.input[this.index - amount];
    }

    private peek(amount = 1): string {
        return this.input[this.index + amount];
    }

    private current(): string {
        return this.input[this.index];
    }

    private parseString(): IToken {
        const quote = this.consume(); // First quote
        let string = "";

        if (quote == '"') {
            while (this.current() != quote) string += this.consume();
            this.consume(); // Consume end quote

            return { type: Literal.STRING, value: string };
        } else {
            const char = this.consume();
            if (this.current() != quote) error(1);
            this.consume(); // Consume the other quote
            return { type: Literal.CHAR, value: char };
        }
    }

    private parseNumber(): IToken {
        let numString = this.consume();

        while (this.current().match(/[0-9]/)) numString += this.consume();

        if (this.current() != "." && this.current() != "f")
            return { type: Literal.INT, value: parseInt(numString) };
        else if (this.current() == "f") {
            this.consume();
            return { type: Literal.FLOAT, value: parseFloat(numString) };
        }

        numString += this.consume(); // Consume period
        while (this.current().match(/[0-9]/)) numString += this.consume();
        if (this.current() != "f") error(2);
        this.consume() // Consume 'f'

        return { type: Literal.FLOAT, value: parseFloat(numString) };
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
                const token = { type: TokenType.IDENTIFIER, value: identifier };

                // Check if it's a keyword or a type
                if (identifier === "return") token.type = TokenType.RETURN;
                else if (identifier === "null") token.type = TokenType.NULL;
                else if (types.includes(identifier)) token.type = TokenType.TYPE;
                tokens.push(token);
            } else if (this.current().match(/[0-9'"]/)) {
                // Check for literals
                if (this.current().match(/('|")/)) tokens.push(this.parseString()); // String
                else tokens.push(this.parseNumber()); // Number
            } else if (this.current() === "=") {
                tokens.push({ type: TokenType.EQUALS });
                this.consume();
            } else if (this.current() === ";") {
                tokens.push({ type: TokenType.EOL });
                this.consume();
            } else if (this.current() === "+") {
                tokens.push({ type: TokenType.PLUS });
                this.consume();
            } else if (this.current() === "-") {
                tokens.push({ type: TokenType.MINUS });
                this.consume();
            } else if (this.current() === "*") {
                tokens.push({ type: TokenType.STAR });
                this.consume();
            } else if (this.current() === "/") {
                tokens.push({ type: TokenType.FSLASH });
                this.consume();
            } else if (this.current() === "(") {
                tokens.push({ type: TokenType.OPENPAREN });
                this.consume();
            } else if (this.current() === ")") {
                tokens.push({ type: TokenType.CLOSEPAREN });
                this.consume();
            } else if (this.current() === "{") {
                tokens.push({ type: TokenType.OPENCURLY });
                this.consume();
            } else if (this.current() === "}") {
                tokens.push({ type: TokenType.CLOSECURLY });
                this.consume();
            } else error(10, [this.consume()]);
        }
        tokens.push({ type: TokenType.EOF })

        return tokens;
    }
}

export enum TokenType {
    IDENTIFIER = "identifier",
    EQUALS = "equals",
    PLUS = "plus",
    MINUS = "minus",
    STAR = "star",
    FSLASH = "slash",
    OPENPAREN = "openparen",
    CLOSEPAREN = "closeparen",
    OPENCURLY = "opencurly", 
    CLOSECURLY = "closecurly", 
    TYPE = "type",
    RETURN = "return",
    NULL = "null",
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
    type: TokenType | Literal;
    value?: string | number | boolean;
}

export const NULL: IToken = { type: TokenType.NULL };

export const getBinPrec = (binOp: TokenType | Literal): number | null => {
    switch (binOp) {
        case TokenType.STAR:
        case TokenType.FSLASH: return 1;
        case TokenType.PLUS:
        case TokenType.MINUS: return 0;
        default: return null;
    }
}
