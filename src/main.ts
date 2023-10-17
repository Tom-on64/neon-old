import { Generator } from "./generator.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

const file = Deno.readTextFileSync(Deno.args[0]);
const lexer = new Lexer();
const parser = new Parser();
const generator = new Generator();

const tokens = lexer.tokenize(file);
console.log(tokens)
const ast = parser.parse(tokens);
console.log(ast);
// const program = generator.generate(ast);
// console.log(program);
