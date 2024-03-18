/**
 * Returns a readable stream of standard input.\
 * This module is compatible with Deno and Node OOTB.\
 * To support web, a custom implementation is required.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation } from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { nodeReadableStreamToWeb, process } from "./_node/mod.ts";

interface StdinOptions {
  raw?: boolean;
  /** Provide a custom implementation the web environment. */
  byoWebImplementation?: (options?: StdinOptions) =>
    | ReadableStream<Uint8Array>
    | Promise<ReadableStream<Uint8Array>>;
}

/**
 * Returns a readable stream of standard input.
 *
 * @throws {MissingByoWebImplementation} when running in a browser and no `options.byoWebImplementation` is provided.
 */
export async function stdin(
  options?: StdinOptions,
): Promise<ReadableStream<Uint8Array>> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      if (typeof options?.raw === "boolean") {
        Deno.stdin.setRaw(options?.raw);
      }
      return Deno.stdin.readable;
    case Runtime.Node:
      if (typeof options?.raw === "boolean") {
        process.stdin.setRawMode(options.raw);
      }
      return nodeReadableStreamToWeb(process.stdin);
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return await options.byoWebImplementation(options);
      }
      throw new MissingByoWebImplementation("stdin");
  }
}
