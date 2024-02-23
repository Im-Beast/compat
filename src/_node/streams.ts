import type { Buffer } from "./buffer.ts";

export interface StreamModule {
  Readable: {
    new <T>(...args: unknown[]): NodeReadableStream<T>;
    toWeb<T, W>(readable: NodeReadableStream<T>): ReadableStream<W>;
  };
  Writable: {
    new <T>(...args: unknown[]): NodeWritableStream<T>;
    toWeb<T, W>(writable: NodeWritableStream<T>): WritableStream<W>;
  };
}

export declare abstract class NodeReadableStream<T> {
  constructor(...args: unknown[]);

  on(event: "data", listener: (chunk: Buffer) => void): this;
  [Symbol.asyncIterator](): AsyncIterableIterator<T>;

  static toWeb<T, W>(readable: NodeReadableStream<T>): ReadableStream<W>;
}

export declare abstract class NodeWritableStream<T> {
  constructor(...args: unknown[]);

  static toWeb<T, W>(writable: NodeWritableStream<T>): WritableStream<W>;
}

export async function stream(): Promise<StreamModule> {
  // deno-lint-ignore no-explicit-any
  return await import("node:stream") as any;
}

export async function nodeReadableStreamToWeb<T>(
  readable: NodeReadableStream<T>,
): Promise<ReadableStream<T>> {
  const mod = await stream();
  return mod.Readable.toWeb(readable);
}

export async function nodeWritableStreamToWeb<T>(
  writable: NodeWritableStream<T>,
): Promise<WritableStream<T>> {
  const mod = await stream();
  return mod.Writable.toWeb(writable);
}
