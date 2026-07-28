import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "About the atelier",
  description:
    "House of Sirka is a Windhoek boutique making dresses, tailoring and intimate collections with an old-world hand and a bright modern pulse.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ContentShell
      title="About the atelier"
      intro="House of Sirka began in Windhoek with a simple frustration: clothes that fit almost, but never quite."
    >
      <Section heading="How we work">
        <p>
          Every piece is chosen or cut for a real body rather than a size chart. We keep a small rail
          on purpose — a considered edit of dresses, tailoring and intimate collections, held in
          depth across sizes rather than spread thin across styles.
        </p>
        <p>
          Fittings happen in the workroom, not a warehouse. If a hem needs shortening or a waist
          taking in, that happens here, by the same hands that checked the piece before it was packed.
        </p>
      </Section>

      <Section heading="What we hold to">
        <ul className="grid gap-2">
          <li>Prices shown in full, in Namibian dollars, before you reach checkout.</li>
          <li>Real measurements on every piece, so you can decide before it arrives.</li>
          <li>One complimentary alteration on anything bought from the boutique.</li>
          <li>Payment methods that work here — eWallet, EFT, card, or on delivery.</li>
        </ul>
      </Section>

      <Section heading="Visiting">
        <p>
          The atelier is in Windhoek and open by appointment for fittings and collections. Message us
          and we will find a time.
        </p>
      </Section>
    </ContentShell>
  );
}
