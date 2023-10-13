import { Lexer } from "./lexer.ts";

const file = Deno.readTextFileSync(Deno.args[0]);
const lexer = new Lexer();

lexer.tokenize(file);
