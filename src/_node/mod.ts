import type { NodePermission } from "./permissions.ts";
import type { NodeReadableStream, NodeWritableStream } from "./streams.ts";

export * from "./permissions.ts";
export * from "./child_process.ts";
export * from "./streams.ts";
export * from "./buffer.ts";
export * from "./fs.ts";
export * from "./error.ts";
export * from "./os.ts";

export interface Process {
  env: { [key: string]: string };
  platform:
    | "aix"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32"
    // ! android support is experimental on node
    | "android";
  permission: {
    has(permission: NodePermission, specific?: string): boolean;
  };
  stdin: NodeReadableStream<Uint8Array> & { setRawMode(mode: boolean): void };
  stdout: NodeWritableStream<Uint8Array>;
  stderr: NodeWritableStream<Uint8Array>;
}

// deno-lint-ignore no-explicit-any
export const process = (globalThis as any)?.process as Process;
