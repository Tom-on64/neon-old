import { Config } from "./Config.ts";
import { Neon } from "./Neon.ts";

class Token {
  type: string;
  value: string | number | boolean | undefined;
  constructor(type: string, value?: string | number | boolean | undefined) {
    this.type = type;
    this.value = value;
  }
}

export class Lexer {
  input = "";
  config: Config;
  position: number;
  currentChar: string | null;
  keywords: Array<string>;
  modifiers: Array<string>;
  types: Array<string>;
  special: Array<string>;
  col: number;
  row: number;

  constructor(config: Config) {
    this.config = config;
    this.position = 0;
    this.currentChar = "";
    this.keywords = [
      "import",
      "if",
      "else",
      "for",
      "while",
      "try",
      "chatch",
      "break",
      "continue",
      "class",
      "return",
      "this",
      "super",
      "null",
      "true",
      "false",
      "new",
    ];
    this.modifiers = [
      "public",
      "private",
      "static",
      "abstract",
      "virtual",
      "override",
      "protected",
    ];
    this.types = ["bool", "int", "float", "string", "void", "class", "object"];
    this.special = [
      "{",
      "}",
      "(",
      ")",
      "[",
      "]",
      ",",
      ".",
      "=",
      "!",
      "=",
      ">",
      "<",
      "+",
      "-",
      "/",
      "*",
      "%",
      "&",
      "|",
      "^",
      "~",
      "?",
    ];

    this.col = 0;
    this.row = 0;
  }

  advance(amount = 1) {
    this.position += amount;
    this.col += amount;
    if (this.position >= this.input.length) this.currentChar = null;
    else this.currentChar = this.input[this.position];
  }

  skipWhitespace() {
    while (this.currentChar !== null && /\s/.test(this.currentChar))
      this.advance;
  }

  peek(amount = 1) {
    return this.input[this.position + amount];
  }

  string() {
    this.advance();
    if (this.currentChar === null) {
      Neon.error(0, this.row, this.col);
      return;
    }
    if (this.currentChar === '"') {
      this.advance();
      return new Token("string", "");
    }
    let characters = this.currentChar;
    this.advance();

    while (this.currentChar !== '"') {
      characters += this.currentChar;
      this.advance();
    }

    this.advance();
    return new Token("string", characters);
  }

  number() {
    let number = this.currentChar;
    if (number === null) {
      Neon.error(69, this.row, this.col);
      return;
    }
    this.advance();

    let dotCount = 0;
    while (this.currentChar !== null && /[0-9]|\./.test(this.currentChar)) {
      if (this.currentChar === ".") {
        dotCount++;
        if (dotCount > 1) {
          Neon.error(101, this.row, this.col);
          break;
        }
      }
      number += this.currentChar;
      this.advance();
    }

    if (dotCount === 0) return new Token("int", parseInt(number));
    else if (this.currentChar === "f") {
      return new Token("float", parseFloat(number));
    } else {
      Neon.error(102, this.row, this.col);
      return new Token("Neon.error", 2);
    }
  }

  getNextToken() {
    while (this.currentChar !== null) {
      if (/[0-9]/.test(this.currentChar)) return this.number();

      if (/\w/.test(this.currentChar)) {
        let identifier = "";
        while (this.currentChar !== null && /\w/.test(this.currentChar)) {
          identifier += this.currentChar;
          this.advance();
        }

        if (this.keywords.includes(identifier)) {
          return new Token("keyword", identifier);
        } else if (this.modifiers.includes(identifier)) {
          return new Token("modifier", identifier);
        } else if (this.types.includes(identifier))
          return new Token("type", identifier);

        return new Token("identifier", identifier);
      }

      if (this.special.includes(this.currentChar)) {
        const tkn = this.currentChar;
        this.advance();
        return new Token("special", tkn);
      }

      if (this.currentChar == ";") {
        this.advance();
        this.row++;
        this.col = 0;
        return new Token("EOL");
      }

      if (this.currentChar == ":") {
        this.advance();
        return new Token("keyword", "extends");
      }

      if (this.currentChar === '"') {
        return this.string();
      }

      this.advance();
    }
    return new Token("EOF");
  }

  tokenize(input: string, logToken = false) {
    this.input = input;

    const tokens: Array<Token> = [];
    let token = this.getNextToken();

    while (token?.type !== "EOF") {
      if (!token) break;
      tokens.push(token);
      if (logToken) console.log(token);
      token = this.getNextToken();
    }

    tokens.push(new Token("EOF"));

    return tokens;
  }
}
