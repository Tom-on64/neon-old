import { error } from "./error.ts";
import { IToken, TokenType, Literal, NULL } from "./lexer.ts";

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

    private parseExpression(): INodeExpr {
        if (this.current().type === Literal.INT) {
            return { value: this.consume() };
        } else if (this.current().type === TokenType.IDENTIFIER) {
            return { value: this.consume() };
        } else return { value: NULL };
    }

    parse(tokens: IToken[]): INodeProgram {
        this.index = 0;
        this.tokens = tokens;

        const programNode: INodeProgram = { statements: [] };

        while (this.current().type !== TokenType.EOF) {
            if (this.current().type === TokenType.RETURN) { 
                // Return statement
                this.consume(); // Consume the return
                const statement: INodeStatement = { statement: { returnExpr: this.parseExpression() } };
                programNode.statements.push(statement);
                if (this.current().type !== TokenType.EOL) error(4); // ';' Check
                else this.consume();
            } else if (this.current().type === TokenType.TYPE && this.peek().type === TokenType.IDENTIFIER) { 
                // Variable declaration
                const type = this.consume();
                const identifier = this.consume();
                if (this.current().type === TokenType.EOL) { // Declaration without a value
                    this.consume(); // Consume the ';'
                    programNode.statements.push({ statement: { type, identifier, expression: { value: NULL } } });
                } else if (this.current().type === TokenType.EQUALS) {
                    this.consume(); // Consume the '='
                    programNode.statements.push({ statement: { type, identifier, expression: this.parseExpression() } })
                } else error(6);
            } else this.consume();
        }

        return programNode;
    }
}



interface INodeExpr {
    value: IToken;
}
interface INodeReturn {
    returnExpr: INodeExpr;
}
interface INodeDeclare {
    identifier: IToken;
    expression: INodeExpr;
    type: IToken;
}
interface INodeStatement {
    statement: INodeReturn | INodeDeclare;
}
export interface INodeProgram {
    statements: INodeStatement[];
}
