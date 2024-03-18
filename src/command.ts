/**
 * Run a command with the given arguments and options.\
 * This module is compatible with Deno and Node OOTB.\
 * To support web, a custom implementation is required.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";
import { hasPermission, Permission } from "./permissions.ts";
import { MissingByoWebImplementation, PermissionDenied } from "./errors.ts";

import { urlToPath } from "./_shared/path.ts";
import { mergeUint8Arrays } from "./_shared/merge_uint8.ts";

import { Deno } from "./_deno/mod.ts";
import {
  childProcess,
  process,
  type SpawnOptions as NodeSpawnOptions,
  type StdioMode as NodeStdioMode,
} from "./_node/mod.ts";

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

  /** Provide a custom implementation for the web environment */
  byoWebImplementation?: (
    options?: CommandOptions,
  ) => CommandOutput | Promise<CommandOutput>;
}

// TODO(Im-Beast): Verify that errors thrown are the same between runtimes.

/**
 * Run a command with the given arguments and options.
 *
 * @throws {PermissionDenied} when the command does not have the `run` permission.
 * @throws {MissingByoWebImplementation} when the runtime does not have an implementation for this function (e.g. Web).
 */
export async function command(
  command: string | URL,
  args: string[],
  options: CommandOptions,
): Promise<CommandOutput | undefined> {
  if (!(await hasPermission(Permission.Run, command))) {
    throw new PermissionDenied(Permission.Run);
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
      if (options.byoWebImplementation) {
        return await options.byoWebImplementation(options);
      }
      throw new MissingByoWebImplementation("command");
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
