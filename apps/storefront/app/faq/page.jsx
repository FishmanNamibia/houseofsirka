import ContentShell, { Section } from "@/components/layout/ContentShell";

export const metadata = {
  title: "Frequently asked questions",
  description:
    "Sizing, alterations, payment methods, delivery times and returns for House of Sirka.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "How do I know which size to order?",
    a: "Every piece lists body measurements in centimetres on the size guide. If you fall between two sizes in a fitted style, take the larger — we can take it in for you.",
  },
  {
    q: "How can I pay?",
    a: "eWallet, EFT bank transfer, PayPulse, EasyWallet, Send Money, Pay2Cell, or cash on delivery. We do not take card details — each transfer asks for a proof-of-payment upload at checkout, which is what clears the order.",
  },
  {
    q: "How long does delivery take?",
    a: "One to two working days in Windhoek, two to three to the coast, and three to five elsewhere in Namibia. Bespoke tailoring adds five to ten working days.",
  },
  {
    q: "Is delivery really free?",
    a: "Within Windhoek, on orders over N$1,500. Everything else is priced on the shipping page and shown in your cart before you pay.",
  },
  {
    q: "Can I return intimate collections?",
    a: "No — once the sealed packaging is opened these cannot be returned or exchanged, for hygiene reasons. Everything else has a 14-day window.",
  },
  {
    q: "Do you alter pieces?",
    a: "Yes, and the first alteration on anything bought from the boutique is included. Hems, waists and straps are done at our Windhoek workroom.",
  },
];

export default function FaqPage() {
  return (
    <ContentShell
      title="Frequently asked questions"
      intro="If your question is not answered here, message the workroom on WhatsApp."
    >
      {FAQS.map((item) => (
        <Section key={item.q} heading={item.q}>
          <p>{item.a}</p>
        </Section>
      ))}
    </ContentShell>
  );
}
