import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Returns & exchanges",
  description:
    "A 14-day exchange window on unworn pieces, with the hygiene exclusion on intimate collections stated plainly.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <ContentShell
      title="Returns & exchanges"
      intro="Fourteen days from the day your order reaches you. We would rather you had the right size than the wrong piece."
    >
      <Section heading="What we accept">
        <ul className="grid gap-2">
          <li>Unworn, unwashed pieces with the original tags still attached.</li>
          <li>Returned within 14 days of delivery or collection.</li>
          <li>Accompanied by your order number.</li>
        </ul>
      </Section>

      <Section heading="What we cannot accept">
        <ul className="grid gap-2">
          <li>
            <strong>Intimate collections</strong> — for hygiene reasons these cannot be returned or
            exchanged once the sealed packaging is opened. This is the one firm exception, and we
            would rather say so here than at the till.
          </li>
          <li>Pieces altered at your request, since they were cut to your measurements.</li>
          <li>Anything showing wear, scent or damage.</li>
        </ul>
      </Section>

      <Section heading="Exchanges">
        <p>
          The quickest route is a size exchange: message us, and if the size you need is held we
          reserve it while your return is on its way. Exchanges within Windhoek carry no extra
          delivery charge.
        </p>
      </Section>

      <Section heading="Refunds">
        <p>
          Once your return is received and checked, refunds are issued by EFT to the account you
          paid from, whichever method you used. Allow 5–7 working days for it to reflect. Original
          delivery charges are refunded only where the piece was faulty or we sent the wrong item.
        </p>
      </Section>

      <Section heading="Faulty pieces">
        <p>
          If something arrives flawed, tell us within 48 hours with a photograph. We collect it at our
          cost and either repair, replace or refund it — your choice.
        </p>
      </Section>
    </ContentShell>
  );
}
