import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Shipping & delivery",
  description:
    "Delivery options, timeframes and costs for Windhoek, the coast and the rest of Namibia. Free Windhoek delivery over N$1,500.",
  alternates: { canonical: "/shipping" },
};

const RATES = [
  { area: "Windhoek", time: "1–2 working days", cost: "N$95 · free over N$1,500" },
  { area: "Swakopmund & Walvis Bay", time: "2–3 working days", cost: "N$140" },
  { area: "Other Namibian towns", time: "3–5 working days", cost: "N$180" },
  { area: "Atelier collection", time: "Same day once ready", cost: "Free" },
];

export default function ShippingPage() {
  return (
    <ContentShell
      title="Shipping & delivery"
      intro="Costs and timeframes are shown here in full and again in your cart before you pay — you should never meet a surprise at checkout."
    >
      <Section heading="Rates and timeframes">
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[480px] border-collapse text-body-sm">
            <caption className="sr-only">Delivery rates and timeframes by area</caption>
            <thead>
              <tr className="border-b border-brass-400 text-left">
                <th scope="col" className="py-3 pr-4 font-semibold text-ink-800">Area</th>
                <th scope="col" className="py-3 pr-4 font-semibold text-ink-800">Typical time</th>
                <th scope="col" className="py-3 font-semibold text-ink-800">Cost</th>
              </tr>
            </thead>
            <tbody>
              {RATES.map((r) => (
                <tr key={r.area} className="border-b border-brass-200">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold text-wine-800">{r.area}</th>
                  <td className="py-3 pr-4 text-ink-700">{r.time}</td>
                  <td className="tabular py-3 text-ink-700">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section heading="How your order moves">
        <ul className="grid gap-2">
          <li>Your order is confirmed and, where payment is on proof, verified by the atelier.</li>
          <li>Pieces are checked, pressed and packed — usually within one working day.</li>
          <li>You receive a message with the courier or collection details.</li>
          <li>Bespoke tailoring and alterations add 5–10 working days; we confirm the date with you.</li>
        </ul>
      </Section>

      <Section heading="Payment before dispatch">
        <p>
          eWallet and EFT orders are dispatched once payment reflects. Uploading your proof of payment at
          checkout is the fastest route — it usually clears the same working day.
        </p>
      </Section>
    </ContentShell>
  );
}
