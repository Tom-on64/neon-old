import { error } from "./error.ts";
import { Literal, TokenType } from "./lexer.ts";
import { INodeAssign, INodeBinExpr, INodeExpr, INodeProgram, INodeScope, INodeStatement, INodeTerm } from "./parser.ts";

export class Generator {
    private output = "";
    private stackSize = 0;
    private vars: IVariable[] = [];
    private scopes: number[] = [];
    private labelCount = 0;

    private genTerm(term: INodeTerm) {
        if (term._type === "token" && term.type === TokenType.IDENTIFIER) {
            const _var = this.getVar(term.value as string);
            if (!_var) return error(0, [`Undeclared identifier '${term.value}'.`]);
            const offset = `QWORD [rsp + ${(this.stackSize - _var.stackLoc - 1) * 8}]`;
            this.push(offset);
        } else if (term._type === "token" && term.type === Literal.INT) {
            this.output += `    mov rax, ${term.value}\n`;
            this.push("rax");
        } else if (term._type === "paren") this.genExpression(term.innerExpr);
    }

    private genBinExpr(binExpr: INodeBinExpr) {
        this.genExpression(binExpr.rhs);
        this.genExpression(binExpr.lhs);
        this.pop("rax");
        this.pop("rbx");
        if (binExpr._type === "add") this.output += "    add rax, rbx\n";
        else if (binExpr._type === "sub") this.output += "    sub rax, rbx\n";
        else if (binExpr._type === "mult") this.output += "    mul rbx\n";
        else if (binExpr._type === "div") this.output += "    div rbx\n";
        this.push("rax");
    }

    private genExpression(expr: INodeExpr) {
        if (expr.value._type === "token" || expr.value._type === "paren") this.genTerm(expr.value);
        else this.genBinExpr(expr.value);
    }

    private genScope(scope: INodeScope) {
        this.beginScope();
        scope.statements.forEach(s => this.genStatement(s));
        this.endScope();
    }

    private genAssign(assign: INodeAssign) {
        this.genExpression(assign.expression);
        this.pop("rax");
        if (!assign.identifier.value || typeof (assign.identifier.value) !== "string") return error(0, ["you fucked up"]);
        const _var = this.getVar(assign.identifier.value);
        if (!_var) return error(0, ["Assignment to undefined variable."])
        const offset = this.stackSize - _var.stackLoc;
        this.output += `    add rsp, ${offset * 8}\n`;
        this.push("rax");
        this.output += `    sub rsp, ${(offset - 1) * 8}\n`
        this.stackSize--;
    }

    private genStatement(stmt: INodeStatement) {
        if (stmt._type == "return") {
            this.genExpression(stmt.returnExpr);
            this.output += "    mov rax, 0x02000001\n";
            this.pop("rdi");
            this.output += "    syscall\n";
        } else if (stmt._type == "declare") {
            if (!stmt.identifier.value || typeof (stmt.identifier.value) !== "string") return error(0, ["you fucked up"]);
            if (this.getVar(stmt.identifier.value)) return error(0, ["Variable already exists."])
            this.vars.push({ identifier: stmt.identifier.value, stackLoc: this.stackSize });
            this.genExpression(stmt.expression);
        } else if (stmt._type === "scope") this.genScope(stmt);
        else if (stmt._type === "if") {
            this.genExpression(stmt.conditionExpr);
            this.pop("rax");
            const label = this.createLabel();
            let endLabel;
            this.output += "    test rax, rax\n";
            this.output += `    jz ${label}\n`;
            this.genScope(stmt.scope);
            if (stmt.else) {
                endLabel = this.createLabel();
                this.output += `    jmp ${endLabel}\n`
            }
            this.output += `${label}:\n`;
            if (stmt.else) {
                this.genScope(stmt.else);
                this.output += `${endLabel}:\n`;
            }
        } else if (stmt._type === "assign") this.genAssign(stmt);
    }

    generate(root: INodeProgram): string {
        this.output += "[global _start]\n_start:\n";

        root.statements.forEach(stmt => this.genStatement(stmt));

        this.output += ".exit:\n"
        this.output += "    mov rax, 0x02000001\n";
        this.output += "    mov rdi, 0\n";
        this.output += "    syscall\n";

        return this.output;
    }

    private push(reg: string) {
        this.output += `    push ${reg}\n`;
        this.stackSize++;
    }

    private pop(reg: string) {
        this.output += `    pop ${reg}\n`;
        this.stackSize--;
    }

    private createLabel(): string {
        return `label${this.labelCount++}`;
    }

    private getVar(_var: string): IVariable | undefined {
        let out: IVariable | undefined;
        this.vars.forEach(v => {
            if (v.identifier === _var) out = v;
        });

        return out;
    }

    private beginScope() {
        this.scopes.push(this.vars.length);
    }

    private endScope() {
        const varCount = this.scopes.at(-1);
        if (varCount === undefined) return error(0, ["You must begin a scope before ending it!"]);
        const popCount = this.vars.length - varCount;
        this.output += `    add rsp, ${popCount * 8}\n`;
        this.stackSize -= popCount;
        for (let i = 0; i < popCount; i++) this.vars.pop();
        this.scopes.pop();
    }
}

interface IVariable {
    identifier: string;
    stackLoc: number;
}
