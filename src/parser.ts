import { error } from "./error.ts";
import { IToken, TokenType, Literal, NULL, getBinPrec } from "./lexer.ts";

export class Parser {
    private index = 0;
    private tokens = new Array<IToken>();

    private consume(amount = 1): IToken {
        const token = this.tokens[this.index];
        this.index += amount;
        return token;
    }

    private peek(amount = 1): IToken {
        if (amount > this.tokens.length - this.index) error(5);
        return this.tokens[this.index + amount]
    }

    private current(): IToken {
        return this.tokens[this.index];
    }

    private parseTerm(): INodeTerm {
        if (this.current().type === Literal.INT)
            return this.consume();
        else if (this.current().type === TokenType.IDENTIFIER)
            return this.consume();
        else return NULL;
    }

    private parseExpression(min_prec = 0): INodeExpr {
        const term_lhs: INodeExpr = { value: this.parseTerm() };
        if (term_lhs.value === NULL) return { value: NULL };

        const expr: INodeExpr = { value: NULL };

        while (true) {
            const op = this.current();
            const prec = getBinPrec(this.current().type);
            console.log(min_prec, prec, op);
            if (!op || prec === null || prec < min_prec) break;

            this.consume(); // Consume the operator
            const next_min_prec = prec + 1;
            const term_rhs = this.parseExpression(next_min_prec);

            if (term_rhs.value === NULL) error(3);

            if (op.type === TokenType.PLUS) {
                const add: INodeBinAdd = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = add;
            } else if (op.type === TokenType.MULT) {
                const mult: INodeBinMult = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = mult;
            } else error(8);

            term_lhs.value = expr.value;
        }

        return term_lhs;
    }

    parse(tokens: IToken[]): INodeProgram {
        this.index = 0;
        this.tokens = tokens;

        const programNode: INodeProgram = { statements: [] };

        while (this.current().type !== TokenType.EOF) {
            if (this.current().type === TokenType.RETURN) {
                // Return statement
                this.consume(); // Consume the return
                const statement: INodeStatement = { returnExpr: this.parseExpression() };
                programNode.statements.push(statement);
                if (this.current().type !== TokenType.EOL) error(4); // ';' Check
                else this.consume();
            } else if (this.current().type === TokenType.TYPE && this.peek().type === TokenType.IDENTIFIER) {
                // Variable declaration
                const type = this.consume();
                const identifier = this.consume();
                if (this.current().type === TokenType.EOL) { // Declaration without a value
                    this.consume(); // Consume the ';'
                    programNode.statements.push({ type, identifier, expression: { value: NULL } });
                } else if (this.current().type === TokenType.EQUALS) {
                    this.consume(); // Consume the '='
                    programNode.statements.push({ type, identifier, expression: this.parseExpression() });
                    if (this.current().type !== TokenType.EOL) error(4);
                    this.consume(); // Consume the ';'
                } else error(6);
            } else this.consume();
        }

        return programNode;
    }
}

interface INodeExpr {
    value: INodeTerm | INodeBinExpr;
}
type INodeTerm = IToken;
interface INodeBinAdd {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
interface INodeBinMult {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
type INodeBinExpr = INodeBinAdd | INodeBinMult;
interface INodeReturn {
    returnExpr: INodeExpr;
}
interface INodeDeclare {
    identifier: IToken;
    expression: INodeExpr;
    type: IToken;
}
type INodeStatement = INodeReturn | INodeDeclare;
export interface INodeProgram {
    statements: INodeStatement[];
}
