import { describe, expect, it } from "vitest";
import { chooseApi } from "./choose";

describe("which API", () => {
  it("sends a balance to chain and history to Hyperion", () => {
    expect(chooseApi("balance").path).toBe("/v1/chain/get_currency_balance");
    expect(chooseApi("history").family).toBe("hyperion");
    expect(chooseApi("spot-ticker").doc).toBe("https://docs.alcor.exchange/api");
    expect(chooseApi("producer-health").method).toBe("NONE");
    expect(chooseApi("nft").path).toBe("/atomicassets/v1/assets");
    expect(chooseApi("sale").path).toBe("/atomicmarket/v1/sales");
  });
});
