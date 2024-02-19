import type {
  NodeReadableStream,
  NodeWritableStream,
} from "./readable_stream.d.ts";

export interface ChildProcessModule {
  spawn(
    command: string,
    args: string[],
    options: SpawnOptions,
  ): ChildProcess;
}

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
