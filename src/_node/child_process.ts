import type { NodeReadableStream, NodeWritableStream } from "./streams.ts";

export type StdioMode = "pipe" | "overlapped" | "ignore" | "inherit";

export interface SpawnOptions {
  cwd?: string | URL;
  stdio?: StdioMode | [StdioMode, StdioMode, StdioMode];
  /** defaults to process.env */
  env?: Record<string, string>;
  uid?: number;
  gid?: number;
  windowsVerbatimArguments?: boolean;
}

export interface ChildProcess {
  get stderr(): NodeReadableStream | null | undefined;
  get stdin(): NodeWritableStream | null | undefined;
  get stdout(): NodeReadableStream | null | undefined;

  readonly pid: number;
  get killed(): boolean;

  on(event: "data", listener: (code: number) => void): this;
  on(event: "close", listener: (code: number) => void): this;

  kill(signal?: string): boolean;
}

interface ChildProcessModule {
  spawn(
    command: string,
    args: string[],
    options: SpawnOptions,
  ): ChildProcess;
}

export async function childProcess(): Promise<ChildProcessModule> {
  return (await import("node:child_process")) as ChildProcessModule;
}
