export const error = (code = 0) => {
    const err = errors[code];

    console.error(`\u001b[31mERROR: ${err ? err : "Unknown Error"}    \u001b[90mNE${code}`);
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
]
