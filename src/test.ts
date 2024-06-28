/**
 * Creates a test.\
 * This module is currently only compatible with Deno and Node.\
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";

import { type NodeTestContext, test as nodeTest } from "./_node/test.ts";
import { Deno } from "./_deno/mod.ts";
import { MissingTargetImplementation } from "./errors.ts";
import type { DenoTestContext } from "./_deno/test.ts";

interface TestContextCallback {
  (ctx: TestContext): void | Promise<void>;
}

interface TestMethodDefinition {
  (name: string, fn: TestContextCallback): void | Promise<void>;
}

interface TestDefinition extends TestMethodDefinition {
  ignore: TestMethodDefinition;
  ignoreIf(condition: boolean): TestMethodDefinition;
}

interface TestContext {
  step: TestMethodDefinition & {
    ignore: TestMethodDefinition;
    ignoreIf(condition: boolean): TestMethodDefinition;
  };
}

/**
 * Creates a test using `node:test` on Node and `Deno.test` on Deno.
 *
 * @throws {MissingTargetImplementation} when running in a browser
 *
 * @example
 * Basic test
 * ```ts
 * test("1+1=3", () => {
 * 	if (1 + 1 !== 3) {
 * 		throw new Error("1+1 is not equal to 3");
 * 	}
 * });
 * ```
 *
 * @example
 * Ignore test
 * ```ts
 * test.test("1+1=3", () => {
 * 	if (1 + 1 !== 3) {
 * 		throw new Error("1+1 is not equal to 3");
 * 	}
 * }); // It will be skipped
 * ```
 *
 * @example
 * Subtests:
 * ```ts
 * test("Addition", (t) => {
 * 	t.step("1+1=3", () => {
 * 		if (1 + 1 !== 3) {
 * 			throw new Error("1+1 is not equal to 3");
 * 		}
 * 	});
 * });
 * ```
 */
let test: TestDefinition;

switch (whichRuntime()) {
  case Runtime.Deno: {
    const buildCtx = (denoCtx: DenoTestContext): TestContext => {
      const step = (name: string, cb: TestContextCallback) =>
        denoCtx.step(name, (ctx) => cb(buildCtx(ctx)));

      return {
        step: Object.assign(step, {
          ignore(name: string, cb: TestContextCallback) {
            const fn = (ctx: DenoTestContext) => cb(buildCtx(ctx));
            return denoCtx.step({ name, fn, ignore: true });
          },
          ignoreIf(condition: boolean) {
            return condition ? this.ignore : step;
          },
        }),
      };
    };

    const patchedTest = (name: string, cb: TestContextCallback) =>
      Deno.test(name, (ctx) => cb(buildCtx(ctx)));

    test = Object.assign(patchedTest, {
      ignore: Deno.test.ignore,
      ignoreIf(condition: boolean) {
        return condition ? Deno.test.ignore : patchedTest;
      },
    });
    break;
  }
  case Runtime.Node: {
    const testModule = await nodeTest();

    const buildCtx = (nodeCtx: NodeTestContext): TestContext => {
      const step = (name: string, cb: TestContextCallback) =>
        nodeCtx.test(name, (ctx) => cb(buildCtx(ctx)));

      return {
        step: Object.assign(step, {
          // Create a callback to preserve `this`
          ignore: (name: string) => nodeCtx.skip(name),
          ignoreIf(condition: boolean) {
            return condition ? this.ignore : step;
          },
        }),
      };
    };

    const patchedTest = (name: string, cb: TestContextCallback) =>
      testModule.test(name, (nodeCtx) => cb(buildCtx(nodeCtx)));

    test = Object.assign(patchedTest, {
      ignore: testModule.skip,
      ignoreIf(condition: boolean) {
        return condition ? testModule.skip : patchedTest;
      },
    });
    break;
  }
  case Runtime.Browser: {
    throw new MissingTargetImplementation(
      "test",
      "browsers",
      "\ntest isn't implemented for browsers yet.",
    );
  }
}

export { test };
