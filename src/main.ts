import { Config } from "./Config.ts";
import { Neon } from "./Neon.ts";

let filePath = "./Main.ne";
let code = "";
const config = new Config();

const processArgs = () => {
  let arg: string | undefined;

  const args = structuredClone(Deno.args);

  while (args.length > 0) {
    arg = args.shift();
    if (!arg) return;

    if (arg?.startsWith("-")) {
      if (arg === "-o") {
        const path = args.shift();
        config.outputFilePath = path ? path : "./out.nex";
      } else if (arg === "--json") config.json = true;
    } else filePath = arg;
  }
};

processArgs();
try {
  code = Deno.readTextFileSync(filePath);
} catch (e) {
  console.error(e.message);
}

const neon = new Neon(config);
neon.compile(code);
