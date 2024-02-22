import type { Buffer } from "./buffer.ts";

export interface StreamModule {
  Readable: NodeReadableStream;
  Writable: NodeWritableStream;
}

export declare interface NodeReadableStream {
  on(event: "data", listener: (chunk: Buffer) => void): this;
  toWeb<T>(readable: NodeReadableStream): ReadableStream<T>;
}

export declare interface NodeWritableStream {
  toWeb<T>(writable: NodeWritableStream): WritableStream<T>;
}

export async function stream(): Promise<StreamModule> {
  // deno-lint-ignore no-explicit-any
  return await import("node:stream") as any;
}

export async function nodeReadableStreamToWeb<T>(
  readable: NodeReadableStream,
): Promise<ReadableStream<T>> {
  const mod = await stream();
  return mod.Readable.toWeb(readable);
}

export async function nodeWritableStreamToWeb<T>(
  writable: NodeWritableStream,
): Promise<WritableStream<T>> {
  const mod = await stream();
  return mod.Writable.toWeb(writable);
}
