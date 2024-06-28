import { Runtime, whichRuntime } from "./which.ts";

import { type NodeTestContext, test as nodeTest } from "./_node/test.ts";
import { Deno } from "./_deno/mod.ts";
import { MissingTargetImplementation } from "./errors.ts";

interface TestContextCallback {
	(ctx: TestContext): void | Promise<void>;
}

interface TestDefinition {
	(name: string, fn: TestContextCallback): void | Promise<void>;
	ignore(name: string, fn: TestContextCallback): void;
}

interface TestContext {
	step(name: string, ctx: TestContextCallback): void | Promise<void>;
}

/**
 * Creates a test using `node:test` on Node and `Deno.test` on Deno.
 * It mimics a subset of `Deno.test`'s API's
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
		test = Deno.test;
		break;
	}
	case Runtime.Node: {
		const testModule = await nodeTest();

		const buildCtx = (nodeCtx: NodeTestContext): TestContext => ({
			step: (name, cb) => nodeCtx.test(name, (ctx) => cb(buildCtx(ctx))),
		});

		test = Object.assign(
			(name: string, cb: TestContextCallback) =>
				testModule.test(name, (nodeCtx) => cb(buildCtx(nodeCtx))),
			{ ignore: testModule.skip },
		);
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
