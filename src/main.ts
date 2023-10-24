import { Generator } from "./generator.ts";
import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

// Parse cli args
const args = structuredClone(Deno.args);
const options: IOptions = {
    input: "./main.ne",
    output: "./out.asm",
    debug: false,
}
const helpPage = `The Neon programming language

\u001b[1;32mUSAGE:\u001b[0m
    neon <filePath> <options>

\u001b[1;32mOPTIONS:\u001b[0m
    -d              Prints debug info about compilation process 
    -o <filePath>   Specifies the output file path
    --help          Shows this help message
`
while (args.length > 0) {
    if (args[0].startsWith("-")) {
        switch (args[0].replace("-", "")) {
            case "o": {
                args.shift();
                const path = args.shift();
                if (!path) {
                    console.error("Error: expected a file path.");
                    Deno.exit(1);
                }
                options.output = path;
                break;
            } case "d":
                options.debug = true;
                args.shift();
                break;
            case "-help":
                console.log(helpPage);
                break;
            default:
                console.error("Error: Unknown option. Use 'neon --help' for a list of available options.");
                Deno.exit(1);
        }
    } else {
        options.input = args.shift();
    }
}
if (!options.input) {
    console.error("Error: No input file provided!");
    Deno.exit(1);
}

const file = Deno.readTextFileSync(options.input);
const lexer = new Lexer();
const parser = new Parser();
const generator = new Generator();

const tokens = lexer.tokenize(file);
if (options.debug) console.log(tokens);
const ast = parser.parse(tokens);
if (options.debug) console.log(JSON.stringify(ast, undefined, 2)); // Log AST
const program = generator.generate(ast);
Deno.writeTextFileSync(options.output, program);

interface IOptions {
    input: string | undefined;
    output: string;
    debug: boolean;
}

