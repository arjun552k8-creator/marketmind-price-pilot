export type MarketRecord = {
  market: string;
  district: string;
  state: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
};

export type PriceResult = { source: "live" | "sample"; note?: string; records: MarketRecord[] };

export const CROPS = ["Tomato", "Onion", "Potato", "Paddy(Dhan)(Common)", "Wheat", "Brinjal", "Cabbage", "Green Chilli", "Banana", "Cotton"];
export const STATES = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana", "Maharashtra", "Gujarat", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Rajasthan", "West Bengal", "Odisha"];

/** Net return in ₹ = price per quintal × quantity (quintals) − transport cost. */
export function netReturn(pricePerQuintal: number, quantity: number, transport: number): number {
  return pricePerQuintal * quantity - transport;
}

/** Transport cost in ₹ = distance (km) × rate (₹ per km). */
export function transportCost(distanceKm: number, ratePerKm: number): number {
  return Math.max(0, distanceKm) * Math.max(0, ratePerKm);
}

export function bestIndex(values: number[]): number {
  if (values.length === 0) return -1;
  let best = 0;
  values.forEach((v, i) => { if (v > (values[best] ?? -Infinity)) best = i; });
  return best;
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function sampleRecords(commodity: string, state: string): MarketRecord[] {
  const base: Record<string, number> = { Tomato: 1800, Onion: 2400, Potato: 1600, Wheat: 2500, Brinjal: 2000, Cabbage: 1200, "Green Chilli": 3500, Banana: 2200, Cotton: 7000 };
  const b = base[commodity] ?? 2300;
  const names = ["Local Mandi", "District Market", "Regional APMC", "City Wholesale", "Uzhavar Sandhai"];
  const mult = [1, 1.12, 1.2, 1.28, 1.05];
  return names.map((m, i) => {
    const modal = Math.round(b * (mult[i] ?? 1));
    return { market: m, district: "Sample", state, commodity, variety: "Other", arrivalDate: "sample", minPrice: Math.round(modal * 0.85), maxPrice: Math.round(modal * 1.1), modalPrice: modal };
  });
}
