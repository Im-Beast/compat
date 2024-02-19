import { command } from "../../src/command.ts";

const output = await command("echo", ["'Hello world'"], {
  stdin: "piped",
  stdout: "piped",
  stderr: "piped",
});

console.log(output);
console.log("success:", output?.success);
console.log("code:", output?.code);
console.log("stdout:", output?.stdout);
console.log("stderr:", output?.stderr);
