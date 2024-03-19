export interface OSModule {
  release(): string;
}

export async function os(): Promise<OSModule> {
  return await import("node:os") as OSModule;
}
