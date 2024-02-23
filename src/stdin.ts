import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { process } from "./_node/mod.ts";

interface StdinOptions {
  raw?: boolean;
  signal?: AbortSignal;
}

export async function* stdin(
  { raw = false, signal }: StdinOptions,
): AsyncGenerator<Uint8Array> {
  switch (whichRuntime()) {
    case Runtime.Deno: {
      Deno.stdin.setRaw(raw);
      for await (const chunk of Deno.stdin.readable) {
        if (signal?.aborted) break;
        yield chunk;
      }
      break;
    }
    case Runtime.Node: {
      process.stdin.setRawMode(true);
      for await (const chunk of process.stdin) {
        if (signal?.aborted) break;
        yield new Uint8Array(chunk.buffer);
      }
      break;
    }
    case Runtime.Browser: {
      /// TODO: What should be the desired behavior?
      break;
    }
  }
}

