import { Buffer } from "./buffer.ts";

interface ReadFileOptions {
  encoding?: string | null;
  flag?: string;
  signal?: AbortSignal;
}

interface WriteFileOptions {
  encoding?: string | null;
  mode?: number;
  flag?: string;
  flush?: boolean;
  signal?: AbortSignal;
}

interface FSModule {
  readFile(
    path: string | URL,
    options?: string | ReadFileOptions,
  ): Promise<Buffer>;

  writeFile(
    file: string | URL,
    data: string | Uint8Array,
    options?: string | WriteFileOptions,
  ): Promise<void>;
}

export async function fs(): Promise<FSModule> {
  return (await import("node:fs/promises")) as unknown as FSModule;
}
