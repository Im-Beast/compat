import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation } from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { nodeWritableStreamToWeb, process } from "./_node/mod.ts";

interface StdoutOptions {
  /** Provide a custom implementation for the web environment. */
  byoWebImplementation?: (options?: StdoutOptions) =>
    | WritableStream<Uint8Array>
    | Promise<WritableStream<Uint8Array>>;
}

/**
 * Returns a writable stream to standard output.
 *
 * @throws {MissingByoWebImplementation} when running in a browser and no `options.byoWebImplementation` is provided.
 */
export async function stdout(
  options?: StdoutOptions,
): Promise<WritableStream<Uint8Array>> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.stdout.writable;
    case Runtime.Node:
      return await nodeWritableStreamToWeb(process.stdout);
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return await options.byoWebImplementation(options);
      }
      throw new MissingByoWebImplementation("stdout");
  }
}
