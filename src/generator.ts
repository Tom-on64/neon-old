import { error } from "./error.ts";
import { INodeExpr, INodeIf, INodeProgram, INodeReturn, INodeStatement } from "./parser.ts";

export class Generator {
    private output = "";
    private stackSize = 0;
    private vars: IVariable[] = [];

    private push(reg: string) {
        this.output += `    push ${reg}\n`;
        this.stackSize++;
    }

    private pop(reg: string) {
        this.output += `    pop ${reg}\n`;
        this.stackSize--;
    }

    private varExists(_var: string) {
        let exists = false;
        this.vars.forEach(v => {
            if (v.identifier === _var) exists = true
        });
        return exists
    }

    private genExpression(expr: INodeExpr) {
        const val: Object = structuredClone(expr.value);
        if (val._type)
    }

    private genStatement(stmt: INodeStatement) {
        if (stmt._type == "return") {
            this.genExpression(stmt.returnExpr);
            this.output += "    mov rax, 60\n";
            this.pop("rdi");
            this.output += "    syscall\n";
        } else if (stmt._type == "declare") {
            if (!stmt.identifier.value || typeof (stmt.identifier.value) !== "string") return error(0, ["you fucked up"]);
            if (this.varExists(stmt.identifier.value)) return error(0, ["[GEN] Variable already exists."])
            this.vars.push({ identifier: stmt.identifier.value, stackLoc: this.stackSize });
            this.genExpression(stmt.expression);
        }
    }

    generate(root: INodeProgram): string {
        this.output += "[global _start]\n_start:\n";

        root.statements.forEach(stmt => this.genStatement(stmt));

        this.output += "    mov rax, 60\n";
        this.output += "    mov rdi, 0\n";
        this.output += "    syscall\n";

        return this.output;
    }
}

interface IVariable {
    identifier: string;
    stackLoc: number;
}
