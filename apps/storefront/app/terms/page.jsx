import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Terms",
  description: "The terms that apply when you buy from House of Sirka.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ContentShell title="Terms" intro="Plain terms for buying from the boutique.">
      <Section heading="Orders">
        <p>
          An order is confirmed once payment is received or, for payment on delivery, once we
          acknowledge it. Prices are in Namibian dollars and include VAT where it applies.
        </p>
      </Section>

      <Section heading="Stock">
        <p>
          Our rail is small and pieces are held in limited quantities. If something sells out between
          your order and our packing it, we contact you and refund in full.
        </p>
      </Section>

      <Section heading="Returns">
        <p>
          The returns policy forms part of these terms, including the hygiene exclusion on intimate
          collections.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>These terms are governed by the laws of the Republic of Namibia.</p>
      </Section>
    </ContentShell>
  );
}
