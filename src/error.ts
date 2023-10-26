export const error = (code = 0, args: string[] = []): never => {
    let err = errors[code];

    args.forEach((arg, i) => {err = err.replaceAll(`%${i}`, arg)});

    console.error(`\u001b[31mError: ${err ? err : "Unknown Error"}    \u001b[1m\u001b[90mNE${code}\u001b[0m`);
    return Deno.exit(1);
}

const errors = [
    "%0", // 0
    "[LEX] Expected single character, but got more.", // 1
    "[LEX] Expected 'f' after float literal.", // 2
    "[LEX] Invalid character '%0'.", // 3
    "[AST] Unable to parse expression.", // 4
    "[AST] Expected %0.", // 5
    "[AST] Peek out of range.", // 6
    "[AST] Expected statement, but got %0.", // 7
    "[AST] Unknown operator.", // 8
    "[AST] Expected expression.", // 9
    "[LEX] Unexpected End of file.", // 10
]
