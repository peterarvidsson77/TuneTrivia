import { describe, it, expect } from "vitest";
import { ok, fail } from "../src/lib/envelope";

describe("envelope", () => {
  it("ok bygger success-kuvert", () => {
    expect(ok({ a: 1 })).toEqual({ success: true, data: { a: 1 } });
  });

  it("fail bygger error-kuvert", () => {
    expect(fail("nej")).toEqual({ success: false, error: "nej" });
  });
});
