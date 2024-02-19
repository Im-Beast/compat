import type { NodePermission } from "./permissions.ts";
export * from "./permissions.ts";
export * from "./child_process.d.ts";
export * from "./child_process.ts";
export * from "./readable_stream.d.ts";
export * from "./readable_stream.ts";
export * from "./buffer.d.ts";

export interface Process {
  env: { [key: string]: string };
  platform: string;
  permission: {
    has(permission: NodePermission, specific?: string): boolean;
  };
}

// deno-lint-ignore no-explicit-any
export const process = (globalThis as any)?.process as Process;
