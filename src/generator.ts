import { INodeProgram } from "./parser.ts";



export class Generator {
    generate(root: INodeProgram): string {
        const output = JSON.stringify(root, undefined, 2);

        return output;
    }
}