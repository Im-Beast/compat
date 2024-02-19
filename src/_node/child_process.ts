import type { ChildProcessModule } from "./child_process.d.ts";

export async function childProcess(): Promise<ChildProcessModule> {
  // deno-lint-ignore no-explicit-any
  return await import("node:child_process") as any;
}
