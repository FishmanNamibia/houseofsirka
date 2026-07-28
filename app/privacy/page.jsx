import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Privacy",
  description: "What House of Sirka collects, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentShell
      title="Privacy"
      intro="We collect what an order needs and nothing we cannot justify."
    >
      <Section heading="What we collect">
        <ul className="grid gap-2">
          <li>Your name, email, phone and delivery address, to fulfil an order.</li>
          <li>Your order history, so we can answer questions about it.</li>
          <li>Proof-of-payment uploads, where you choose eWallet or EFT.</li>
        </ul>
      </Section>

      <Section heading="What we do not do">
        <p>We do not sell your details, and we do not send marketing unless you asked for it at checkout.</p>
      </Section>

      <Section heading="Your choices">
        <p>
          Write to us and we will send you a copy of what we hold, correct it, or delete it — except
          where we are required to keep sales records.
        </p>
      </Section>
    </ContentShell>
  );
}
