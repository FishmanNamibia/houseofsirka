import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Contact",
  description:
    "Reach the House of Sirka workroom in Windhoek by WhatsApp, phone or email, and book a fitting.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ContentShell
      title="Contact"
      intro="The fastest answer is usually WhatsApp — the workroom reads it through the working day."
    >
      <Section heading="Reach us">
        <ul className="grid gap-2">
          <li><strong>WhatsApp</strong> — <a href="https://wa.me/264810000000">+264 81 000 0000</a></li>
          <li><strong>Phone</strong> — <a href="tel:+264810000000">+264 81 000 0000</a></li>
          <li><strong>Email</strong> — <a href="mailto:hello@houseofsirka.local">hello@houseofsirka.local</a></li>
          <li><strong>Workroom</strong> — Windhoek, Namibia. Open by appointment.</li>
        </ul>
      </Section>

      <Section heading="Fittings and alterations">
        <p>
          Book a fitting by message. Bring your order number if the piece came from us — the first
          alteration is included.
        </p>
      </Section>

      <Section heading="Order questions">
        <p>
          Quote your order number (it looks like HOS-1001) and we can see its status, payment and
          delivery in one place.
        </p>
      </Section>
    </ContentShell>
  );
}
