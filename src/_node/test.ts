export interface NodeTestContextCallback {
  (ctx: NodeTestContext): void | Promise<void>;
}

export interface NodeTestDefinition {
  (name: string): void | Promise<void>;
  (name: string, cb: NodeTestContextCallback): void | Promise<void>;
}

export interface NodeTestContext {
  test(name: string, ctx: NodeTestContextCallback): void | Promise<void>;
}

export interface TestModule {
  test: NodeTestDefinition;
  skip: NodeTestDefinition;
}

export async function test(): Promise<TestModule> {
  return (await import("node:test")) as unknown as TestModule;
}
