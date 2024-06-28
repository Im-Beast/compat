export interface DenoTestContextCallback {
  (ctx: DenoTestContext): void | Promise<void>;
}

export interface DenoTestDefinition {
  (name: string, cb: DenoTestContextCallback): void | Promise<void>;
  ignore(name: string): void | Promise<void>;
  ignore(name: string, cb: DenoTestContextCallback): void | Promise<void>;
}

export interface DenoTestContext {
  step(name: string, ctx: DenoTestContextCallback): void | Promise<void>;
}
