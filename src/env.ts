/**
 * Get the value of environmental variable.
 * This module is compatible with Deno, Node and Web.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation, PermissionDenied } from "./errors.ts";

import { process } from "./_node/mod.ts";
import { Deno } from "./_deno/mod.ts";
import { Permission } from "../main.ts";

/** Options for {@linkcode env} */
interface EnvOptions {
  /** Provide a custom implementation for the web environment. */
  byoWebImplementation?: (
    env: string,
    options?: EnvOptions,
  ) => string | undefined;
}

/**
 * Return the value of environmental variable.\
 * On browser this always returns `undefined`.
 *
 * @throws {PermissionDenied} when running in Deno and permission to environment variables is denied.
 * @throws {MissingByoWebImplementation} when running in a browser and no `options.byoWebImplementation` is provided.
 *
 * @example
 * ```ts
 * const editor = env("EDITOR") ?? "nano";
 * ```
 */
export function env(env: string, options?: EnvOptions): string | undefined {
  switch (whichRuntime()) {
    case Runtime.Deno:
      try {
        return Deno.env.get(env);
      } catch (error) {
        if (error instanceof Deno.errors.PermissionDenied) {
          throw new PermissionDenied(Permission.Env, env);
        }
        throw error;
      }
    case Runtime.Node:
      return process.env[env];
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return options.byoWebImplementation(env, options);
      }
      throw new MissingByoWebImplementation("env");
  }
}
