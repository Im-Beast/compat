export interface NodeTestContextCallback {
  (ctx: NodeTestContext): void | Promise<void>;
}

export interface NodeTestContext {
  test(name: string, ctx: NodeTestContextCallback): void | Promise<void>;
  skip: {
    (name: string, ctx: NodeTestContextCallback): void | Promise<void>;
    (name: string): void | Promise<void>;
  };
}

export interface TestModule {
  test(name: string, cb: NodeTestContextCallback): void | Promise<void>;
  skip: {
    (name: string, cb: NodeTestContextCallback): void | Promise<void>;
    (name: string): void | Promise<void>;
  };
}

export async function test(): Promise<TestModule> {
  return (await import("node:test")) as unknown as TestModule;
}
