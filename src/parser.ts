import { error } from "./error.ts";
import { IToken, TokenType, Literal } from "./lexer.ts";

export class Parser {
    private index = 0;
    private tokens = new Array<Token>();

    private consume(amount = 1): Token {
        const token = this.tokens[this.index];
        this.index += amount;
        return token;
    }

    private peek(amount = 1): IToken {
        return this.tokens[this.index - amount]
    }

    private current(): IToken {
        return this.tokens[this.index];
    }

    parse(tokens: IToken[]) {//: INodeProgram {
        this.index = 0;
        this.tokens = tokens;

        const programNode = Object();

        while (this.current().type !== TokenType.EOF) {
            if (this.current().type === TokenType.RETURN) {
                this.consume();
                if (this.current().type === Literal.INT) {
                    const _return: INodeReturn = { value: { LInt: this.consume() } };
                    programNode.return = _return;
                } else error(3);
                if (this.current().type !== TokenType.EOL) error(4);
                else this.consume();
            } else this.consume();
        }

        return programNode;
    }
}

interface INodeExpr {
    LInt: IToken;
}
interface INodeReturn {
    value: INodeExpr;
}
export interface INodeProgram {
    return: INodeReturn | undefined;
}
