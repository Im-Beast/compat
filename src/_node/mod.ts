import type { NodePermission } from "./permissions.ts";
export * from "./permissions.ts";
export * from "./child_process.d.ts";
export * from "./child_process.ts";
export * from "./readable_stream.d.ts";
export * from "./readable_stream.ts";
export * from "./buffer.d.ts";

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
}

// deno-lint-ignore no-explicit-any
export const process = (globalThis as any)?.process as Process;
