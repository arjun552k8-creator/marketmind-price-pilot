import { describe, it, expect } from "vitest";
import { netReturn, transportCost, bestIndex } from "./markets";

describe("market math", () => {
  it("net return = price × quantity − transport", () => {
    expect(netReturn(2400, 10, 900)).toBe(23100);
  });
  it("transport = distance × rate", () => {
    expect(transportCost(65, 12)).toBe(780);
  });
  it("picks highest net return", () => {
    expect(bestIndex([17800, 21400, 23100])).toBe(2);
  });
});
