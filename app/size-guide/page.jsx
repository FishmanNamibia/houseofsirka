import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Size guide",
  description:
    "Garment measurements, model fit notes and fabric guidance for House of Sirka dresses, tailoring and intimate collections.",
  alternates: { canonical: "/size-guide" },
};

const MEASUREMENTS = [
  { size: "XS", bust: "80–84", waist: "62–66", hip: "88–92" },
  { size: "S", bust: "85–89", waist: "67–71", hip: "93–97" },
  { size: "M", bust: "90–94", waist: "72–76", hip: "98–102" },
  { size: "L", bust: "95–100", waist: "77–82", hip: "103–108" },
  { size: "XL", bust: "101–106", waist: "83–88", hip: "109–114" },
];

export default function SizeGuidePage() {
  return (
    <ContentShell
      title="Size guide"
      intro="All measurements are body measurements in centimetres, not garment measurements. If you fall between two sizes in a fitted style, take the larger one — our atelier can always take a piece in."
    >
      <Section heading="Measurements">
        {/* Wide tables must scroll inside their own container so the page body
            never scrolls horizontally on a phone. */}
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[420px] border-collapse text-body-sm">
            <caption className="sr-only">Body measurements by size, in centimetres</caption>
            <thead>
              <tr className="border-b border-brass-400 text-left">
                <th scope="col" className="py-3 pr-4 font-semibold text-ink-800">Size</th>
                <th scope="col" className="py-3 pr-4 font-semibold text-ink-800">Bust (cm)</th>
                <th scope="col" className="py-3 pr-4 font-semibold text-ink-800">Waist (cm)</th>
                <th scope="col" className="py-3 font-semibold text-ink-800">Hip (cm)</th>
              </tr>
            </thead>
            <tbody>
              {MEASUREMENTS.map((row) => (
                <tr key={row.size} className="border-b border-brass-200">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold text-wine-800">{row.size}</th>
                  <td className="tabular py-3 pr-4 text-ink-700">{row.bust}</td>
                  <td className="tabular py-3 pr-4 text-ink-700">{row.waist}</td>
                  <td className="tabular py-3 text-ink-700">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section heading="How to measure">
        <ul className="grid gap-2">
          <li><strong>Bust</strong> — around the fullest part, tape level and not pulled tight.</li>
          <li><strong>Waist</strong> — the narrowest part of your torso, usually just above the navel.</li>
          <li><strong>Hip</strong> — around the fullest part, roughly 20cm below the waist.</li>
        </ul>
      </Section>

      <Section heading="Fit notes by category">
        <ul className="grid gap-2">
          <li><strong>Dresses</strong> — bias-cut satin styles skim the body; size down if you prefer a looser drape.</li>
          <li><strong>Tailoring</strong> — blazers are cut with room for a light layer beneath. True to size.</li>
          <li><strong>Intimate collections</strong> — cut close. If you are between sizes, take the larger.</li>
          <li><strong>Knitwear</strong> — rib knits have generous stretch and settle to the body after wear.</li>
        </ul>
      </Section>

      <Section heading="Alterations">
        <p>
          Every piece bought from the boutique includes one complimentary alteration at our Windhoek
          atelier — hems, waist adjustments and strap shortening. Bring your order number.
        </p>
      </Section>
    </ContentShell>
  );
}
