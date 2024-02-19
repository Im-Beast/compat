// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
export class Command {
  constructor(command: string | URL, options?: CommandOptions);
  output(): Promise<CommandOutput>;
  outputSync(): CommandOutput;
  spawn(): ChildProcess;
}

export class ChildProcess {
  get stdin(): WritableStream<Uint8Array>;
  get stdout(): ReadableStream<Uint8Array>;
  get stderr(): ReadableStream<Uint8Array>;
  readonly pid: number;
  readonly status: Promise<CommandStatus>;

  output(): Promise<CommandOutput>;
  kill(signo?: string): void;
}

export interface CommandOptions {
  args?: string[];
  cwd?: string | URL;
  clearEnv?: boolean;
  env?: Record<string, string>;
  uid?: number;
  gid?: number;
  signal?: AbortSignal;
  stdin?: "piped" | "inherit" | "null";
  stdout?: "piped" | "inherit" | "null";
  stderr?: "piped" | "inherit" | "null";
  windowsRawArguments?: boolean;
}

export interface CommandStatus {
  success: boolean;
  code: number;
}

export interface CommandOutput extends CommandStatus {
  readonly stdout: Uint8Array;
  readonly stderr: Uint8Array;
}
