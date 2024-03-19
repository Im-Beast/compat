/**
 * Returns a writable stream to standard error.\
 * This module is compatible with Deno and Node OOTB.\
 * To support web, a custom implementation is required.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation } from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { nodeWritableStreamToWeb, process } from "./_node/mod.ts";

/** Options for {@linkcode stderr} */
interface StderrOptions {
  /** Provide a custom implementation for the web environment. */
  byoWebImplementation?: (options?: StderrOptions) =>
    | WritableStream<Uint8Array>
    | Promise<WritableStream<Uint8Array>>;
}

/**
 * Returns a writable stream to standard error.
 *
 * @throws {MissingByoWebImplementation} when running in a browser and no `options.byoWebImplementation` is provided.
 *
 * @example
 * ```ts
 * const stderrStream = await stderr();
 * const writer = stderrStream.getWriter();
 * writer.write(new TextEncoder().encode("Hello, stderr!\n"));
 * writer.close();
 * ```
 */
export async function stderr(
  options?: StderrOptions,
): Promise<WritableStream<Uint8Array>> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.stderr.writable;
    case Runtime.Node:
      return await nodeWritableStreamToWeb(process.stderr);
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return await options.byoWebImplementation(options);
      }
      throw new MissingByoWebImplementation("stderr");
  }
}
