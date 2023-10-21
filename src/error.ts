export const error = (code = 0, args: string[] = []) => {
    let err = errors[code];

    args.forEach((arg, i) => {err = err.replaceAll(`%${i}`, arg)});

    console.error(`\u001b[31mERROR: ${err ? err : "Unknown Error"}    \u001b[1m\u001b[90mNE${code}\u001b[0m`);
    Deno.exit(code);
}

const errors = [
    "Unknown Error.", // 0
    "[LEX] Expected single character, but got more.", // 1
    "[LEX] Expected 'f' after float literal.", // 2
    "[AST] Unable to parse expression.", // 3
    "[AST] Expected ';'.", // 4
    "[AST] Peek out of range.", // 5
    "[AST] Expected '='.", // 6
    "[AST] Expression expected.", // 7
    "[AST] Unsupported binary operator.", // 8
    "[AST] Expected ')'.", // 9
    "[LEX] Invalid character '%0'.", // 10
]
