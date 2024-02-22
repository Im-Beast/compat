import { readFile } from "../../src/read_file.ts";

const data = await readFile("./tests/read_file/mod.ts");

console.log(data);
