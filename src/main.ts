import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

const file = Deno.readTextFileSync(Deno.args[0]);
const lexer = new Lexer();
const parser = new Parser();

const tokens = lexer.tokenize(file);
const ast = parser.parse(tokens);
console.log(ast);
