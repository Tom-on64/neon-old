import { Generator } from "./generator.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

const file = Deno.readTextFileSync(Deno.args[0]);
const lexer = new Lexer();
const parser = new Parser();
const generator = new Generator();

const tokens = lexer.tokenize(file);
// console.log(tokens);
const ast = parser.parse(tokens);
console.log(JSON.stringify(ast, undefined, 2)); // Log AST
const program = generator.generate(ast);
Deno.writeTextFileSync("neon/out.asm", program);
