import { Runtime, whichRuntime } from "./which.ts";
import { hasPermission, Permission, PermissionError } from "./permissions.ts";

import { urlToPath } from "./_shared/path.ts";

import { Deno } from "./_deno/mod.ts";
import {
  childProcess,
  process,
  type SpawnOptions as NodeSpawnOptions,
  type StdioMode as NodeStdioMode,
} from "./_node/mod.ts";
import { mergeUint8Arrays } from "./_shared/merge_uint8.ts";

export interface CommandOutput {
  code: number;
  success: boolean;
  readonly stdout: Uint8Array;
  readonly stderr: Uint8Array;
}

export type StdioMode = "piped" | "inherit" | "null";

export interface CommandOptions {
  cwd?: string | URL;

  stdin?: StdioMode;
  stdout?: StdioMode;
  stderr?: StdioMode;

  env?: Record<string, string>;
  clearEnv?: boolean;
}

export async function command(
  command: string | URL,
  args: string[],
  options: CommandOptions,
): Promise<CommandOutput | undefined> {
  if (!(await hasPermission(Permission.Run, command))) {
    throw new PermissionError(Permission.Run);
  }

  options.stdin ??= "piped";
  options.stdout ??= "piped";
  options.stderr ??= "piped";

  switch (whichRuntime()) {
    case Runtime.Deno: {
      const commandInstance = new Deno.Command(command, {
        args,
        ...options,
      });
      const instance = commandInstance.spawn();
      return await instance.output();
    }
    case Runtime.Node: {
      const childProcessModule = await childProcess();

      const nodeOptions: NodeSpawnOptions = {
        cwd: options.cwd,
        env: {
          ...(options.clearEnv ? {} : process.env),
          ...options.env,
        },
        stdio: [
          convertToNodeStdioMode(options.stdin),
          convertToNodeStdioMode(options.stdout),
          convertToNodeStdioMode(options.stderr),
        ],
      };

      if (command instanceof URL) {
        command = urlToPath(command);
      }

      const instance = childProcessModule.spawn(command, args, nodeOptions);

      const stdoutChunks: Uint8Array[] = [];
      if (instance.stdout) {
        instance.stdout.on("data", (chunk) => {
          stdoutChunks.push(new Uint8Array(chunk.buffer));
        });
      }

      const stderrChunks: Uint8Array[] = [];
      if (instance.stderr) {
        instance.stderr.on("data", (chunk) => {
          stderrChunks.push(new Uint8Array(chunk.buffer));
        });
      }

      let stdout = new Uint8Array();
      let stderr = new Uint8Array();

      const code = await new Promise<number>((resolve) => {
        instance.on("close", (code) => {
          stdout = mergeUint8Arrays(stdoutChunks);
          stderr = mergeUint8Arrays(stderrChunks);
          resolve(code);
        });
      });

      return {
        code,
        stdout,
        stderr,
        success: code === 0,
      };
    }
    default:
      return undefined;
  }
}

function convertToNodeStdioMode(mode: StdioMode): NodeStdioMode {
  switch (mode) {
    case "null":
      return "ignore";
    case "piped":
      return "pipe";
    default:
      return mode;
  }
}
