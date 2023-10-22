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
        if (amount > this.tokens.length - this.index) error(6);
        return this.tokens[this.index + amount]
    }

    private current(): IToken {
        return this.tokens[this.index];
    }

    private tryConsume(type: TokenType) {
        if (this.current().type === type) this.consume();
        else error(5, [type]);
    }

    private parseTerm(): INodeTerm {
        if (this.current().type === Literal.INT)
            return this.consume();
        else if (this.current().type === TokenType.IDENTIFIER)
            return this.consume();
        else if (this.current().type === TokenType.OPENPAREN) {
            this.consume() // Consume the '('
            const paren: INodeParen = { innerExpr: this.parseExpression() };
            this.tryConsume(TokenType.CLOSEPAREN);
            return paren;
        } else return NULL;
    }

    private parseExpression(min_prec = 0): INodeExpr {
        const term_lhs: INodeExpr = { value: this.parseTerm() };
        if (term_lhs.value === NULL) return { value: NULL };

        const expr: INodeExpr = { value: NULL };

        while (true) {
            const op = this.current();
            const prec = getBinPrec(this.current().type);
            if (!op || prec === null || prec < min_prec) break;

            this.consume(); // Consume the operator
            const next_min_prec = prec + 1;
            const term_rhs = this.parseExpression(next_min_prec);

            if (term_rhs.value === NULL) error(4);

            if (op.type === TokenType.PLUS) {
                const add: INodeBinAdd = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = add;
            } else if (op.type === TokenType.MINUS) {
                const mult: INodeBinSub = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = mult;
            } else if (op.type === TokenType.STAR) {
                const mult: INodeBinMult = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = mult;
            } else if (op.type === TokenType.FSLASH) {
                const mult: INodeBinDiv = { lhs: { value: term_lhs.value }, rhs: term_rhs };
                expr.value = mult;
            } else error(8);

            term_lhs.value = expr.value;
        }

        return term_lhs;
    }

    private parseScope(): INodeScope {
        this.consume(); // Consume the '{'
        const scope: INodeScope = { statements: [] };

        // Parse the scope
        while (this.current().type !== TokenType.CLOSECURLY)
            scope.statements.push(this.parseStatement());

        this.consume(); // Consume the '}'

        return scope;
    }

    private parseIf(): INodeIf {
        this.consume(); // Consume the 'if';
        this.tryConsume(TokenType.OPENPAREN);

        const expr = this.parseExpression();
        this.tryConsume(TokenType.CLOSEPAREN);
        if (expr.value === NULL) error(9);

        
        if (this.current().type !== TokenType.OPENCURLY) {
            const stmt = this.parseStatement();
            return { conditionExpr: expr, scope: { statements: [stmt] } };
        }
        const scope = this.parseScope();

        if (this.current().type === TokenType.ELSE) {
            this.consume(); // Consume the 'else'
            let elseScope: INodeScope;
            if (this.current().type !== TokenType.OPENCURLY) {
                const stmt = this.parseStatement();
                elseScope = { statements: [stmt] };
            } else elseScope = this.parseScope();

            return { conditionExpr: expr, scope, else: elseScope };
        }

        return { conditionExpr: expr, scope };
    }

    private parseDeclaration(): INodeDeclare {
        const type = this.consume();
        const identifier = this.consume();
        if (this.current().type === TokenType.EOL) { // Declaration without a value
            this.consume(); // Consume the ';'
            return { type, identifier, expression: { value: NULL } };
        } else if (this.current().type === TokenType.EQUALS) {
            this.consume(); // Consume the '='
            const statement: INodeDeclare = { type, identifier, expression: this.parseExpression() };
            this.tryConsume(TokenType.EOL);
            if (statement.expression.value === NULL) error(9);
            return statement;
        } else return error(6);
    }

    private parseStatement(): INodeStatement {
        if (this.current().type === TokenType.RETURN) {
            this.consume(); // Consume the return
            const statement: INodeReturn = { returnExpr: this.parseExpression() };
            this.tryConsume(TokenType.EOL);
            return statement;
        } else if (this.current().type === TokenType.TYPE && this.peek().type === TokenType.IDENTIFIER) 
            return this.parseDeclaration();
        else if (this.current().type === TokenType.OPENCURLY) 
            return this.parseScope();
        else if (this.current().type === TokenType.IF) 
            return this.parseIf();
        else return error(7, [this.current().type]);
    }

    parse(tokens: IToken[]): INodeProgram {
        this.index = 0;
        this.tokens = tokens;

        const programNode: INodeProgram = { statements: [] };

        while (this.current().type !== TokenType.EOF)
            programNode.statements.push(this.parseStatement());

        return programNode;
    }
}

export interface INodeExpr {
    value: INodeTerm | INodeBinExpr;
}
export interface INodeParen {
    innerExpr: INodeExpr;
}
export type INodeTerm = IToken | INodeParen;
export interface INodeBinAdd {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
export interface INodeBinSub {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
export interface INodeBinMult {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
export interface INodeBinDiv {
    lhs: INodeExpr;
    rhs: INodeExpr;
}
export type INodeBinExpr = INodeBinAdd | INodeBinSub | INodeBinMult | INodeBinDiv;
export interface INodeIf {
    conditionExpr: INodeExpr;
    scope: INodeScope;
    else?: INodeScope;
}
export interface INodeReturn {
    returnExpr: INodeExpr;
}
export interface INodeDeclare {
    identifier: IToken;
    expression: INodeExpr;
    type: IToken;
}
export interface INodeScope {
    statements: INodeStatement[];
}
export type INodeStatement = INodeReturn | INodeDeclare | INodeScope | INodeIf;
export interface INodeProgram {
    statements: INodeStatement[];
}
