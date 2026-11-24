import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sampleRecords, type MarketRecord, type PriceResult } from "./markets";

// data.gov.in "Current Daily Price of Various Commodities from Various Markets (Mandi)" — Agmarknet.
const RESOURCE = "9ef84268-d588-465a-a308-a864a43d0070";
const PUBLIC_SAMPLE_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

export const getMandiPrices = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ commodity: z.string().min(1).max(60), state: z.string().min(1).max(60) }).parse(d))
  .handler(async ({ data }): Promise<PriceResult> => {
    const key = process.env["DATA_GOV_IN_API_KEY"] || PUBLIC_SAMPLE_KEY;
    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE}`);
    url.searchParams.set("api-key", key);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "200");
    url.searchParams.set("filters[commodity]", data.commodity);
    url.searchParams.set("filters[state.keyword]", data.state);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const json = (await res.json()) as { records?: Record<string, string>[] };
      const records: MarketRecord[] = (json.records ?? []).map((r) => ({
        market: r["market"] ?? "",
        district: r["district"] ?? "",
        state: r["state"] ?? data.state,
        commodity: r["commodity"] ?? data.commodity,
        variety: r["variety"] ?? "",
        arrivalDate: r["arrival_date"] ?? "",
        minPrice: Number(r["min_price"]) || 0,
        maxPrice: Number(r["max_price"]) || 0,
        modalPrice: Number(r["modal_price"]) || 0,
      })).filter((r) => r.modalPrice > 0);
      if (records.length === 0) {
        return { source: "sample", note: `No markets reported ${data.commodity} in ${data.state} today. Showing sample figures.`, records: sampleRecords(data.commodity, data.state) };
      }
      return { source: "live", records };
    } catch (e) {
      console.error("mandi fetch failed", e);
      return { source: "sample", note: "Live price feed is unreachable right now. Showing sample figures.", records: sampleRecords(data.commodity, data.state) };
    }
  });
