import { INodeProgram } from "./parser.ts";

export class Generator {
    generate(root: INodeProgram): string {
        let output = "%MAIN\n"

        output += `ret ${root.return?.value.LInt.value}\n`;

        return output;
    }
}