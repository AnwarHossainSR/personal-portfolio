import type { AxeMatchers } from "vitest-axe/matchers";

/*
 * vitest-axe 0.1 declares its matcher on the global `Vi` namespace, which
 * Vitest stopped reading at 1.0, so `toHaveNoViolations` type-checked as
 * missing. The same augmentation, on the module Vitest reads now.
 */
declare module "vitest" {
	interface Assertion<T = any> extends AxeMatchers {}
	interface AsymmetricMatchersContaining extends AxeMatchers {}
}
