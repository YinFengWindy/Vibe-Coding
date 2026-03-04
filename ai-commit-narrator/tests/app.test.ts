import { describe, expect, it } from "vitest";
import { validateRequest } from "../src/app.js";

describe("validateRequest", () => {
  it("accepts empty request", () => {
    expect(() => validateRequest({})).not.toThrow();
  });

  it("throws when only fromTag is provided", () => {
    expect(() => validateRequest({ fromTag: "v0.1.0" })).toThrowError(/需要同时提供/);
  });

  it("throws when only toTag is provided", () => {
    expect(() => validateRequest({ toTag: "v0.2.0" })).toThrowError(/需要同时提供/);
  });
});
