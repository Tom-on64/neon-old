import { Config } from "./Config.ts";
import { Lexer } from "./Lexer.ts";

export class Neon {
  config: Config;
  lexer: Lexer;
  constructor(config: Config) {
    this.config = config;
    this.lexer = new Lexer(config);
  }

  compile(code: string) {
    const tokens = this.lexer.tokenize(code, true);
    console.log(tokens);
    console.log(this.config.outputFilePath);
  }

  static error(errCode: number, row: number, col: number, data?: Array<string>) {
    const message = this.getErrorMessage(errCode, data);
    try {
      throw new Error(
        `\u001b[31m[ERROR] ${message} \u001b[1m${row}:${col} ne(${errCode})`
      );
    } catch (e) {
      console.error(e.message);
    }
  }

  static getErrorMessage(errCode: number, data?: Array<string>): string {
    const msg = `${errCode} - ${data}`;
    return msg;
  }
}
