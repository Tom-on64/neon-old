import { INodeProgram } from "./parser.ts";

export class Generator { // TODO: Make the generator generate objects/executables
    generate(root: INodeProgram): string {
        const output = JSON.stringify(root, undefined, 2);

        return output;
    }
}