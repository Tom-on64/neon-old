import { error } from "./error.ts";

export class Lexer {
    index = 0;
    input = [""];

    consume(amount = 1): string {
        const old = this.input[this.index];
        this.index += amount;
        return old;
    }

    peek(amount = 1): string {
        return this.input[this.index + amount];
    }

    current(): string {
        return this.input[this.index];
    }

    parseString(): Token {
        const quote = this.consume(); // First quote
        let string = "";

        if (quote == '"') {
            while (this.current() != quote) string += this.consume();
            this.consume();

            return new Token("LString", string);
        } else {
            const char = this.consume();
            if (this.current() != quote) error(1);
            this.consume(); // Consume the other quote
            return new Token("LChar", char);
        }
    }

    parseNumber(): Token {
        let numString = this.consume();

        while (this.current().match(/[0-9]/)) numString += this.consume();

        if (this.current() != "." && this.current() != "f") 
            return new Token("LInt", parseInt(numString));
        else if (this.current() == "f") {
            this.consume();
            return new Token("LFloat", parseFloat(numString));
        } 

        numString += this.consume(); // Consume period
        while (this.current().match(/[0-9]/)) numString += this.consume();
        if (this.current() != "f") error(2);
        this.consume() // Consume 'f'
        
        return new Token("LFloat", parseFloat(numString));
    }

    tokenize(file: string) {
        // Prepare file
        this.input = file.replaceAll(/(\s\s+|\n)/g, "").split("");
        const tokens = Array<Token>();

        // Generate the tokens
        while (this.index < this.input.length) {
            if (this.current().match(/[A-Za-z_]/)) {
                // Get an identifier
                let identifier = this.consume();
                while (this.current().match(/[A-Za-z0-9_]/)) identifier += this.consume();

                // Check if it's a keyword or a type, else it's an id
                if (keywords.includes(identifier)) tokens.push(new Token("keyword", identifier));
                else if (types.includes(identifier)) tokens.push(new Token("type", identifier));
                else tokens.push(new Token("identifier", identifier));
            } else if (this.current().match(/[0-9'"]/)) {
                // Check for literals
                if (this.current().match(/('|")/)) tokens.push(this.parseString()); // String
                else tokens.push(this.parseNumber()); // Number
            } else if (operators.includes(this.current())) // Check for operators
                tokens.push(new Token("operator", this.consume()));
            else if (special.includes(this.current())) // Check for special symbols
                tokens.push(new Token("special", this.consume()));
            else if (this.current() == ";") { this.consume(); tokens.push(new Token("EOL")) }
            else this.consume();
        }
        tokens.push(new Token("EOF"));


        console.log(tokens);
    }
}

class Token {
    type: string;
    value: string | number | undefined;
    constructor(type: string, value?: string | number) {
        this.type = type;
        this.value = value;
    }
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
