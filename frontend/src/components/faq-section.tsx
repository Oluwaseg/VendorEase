import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly will I be notified about?",
    answer:
      "You'll receive updates about new product drops, restocks of popular items, special offers, and important store announcements. We keep communications focused and valuable—only sending what matters.",
  },
  {
    question: "Does signing up mean I'm buying something?",
    answer:
      "No. Signing up only puts you on the notification list. You're not required to make any purchase. You can browse and shop whenever you like, completely on your terms.",
  },
  {
    question: "How often will you contact me?",
    answer:
      "Only when there's something important—such as a new drop, restock, or special offer. We don't send daily or unnecessary emails. Quality over quantity is our approach.",
  },
  {
    question: "Can I unsubscribe anytime?",
    answer:
      "Yes. Every message includes a simple unsubscribe option. No questions asked. We respect your inbox and your time.",
  },
  {
    question: "Is VendorEase already live?",
    answer:
      "Yes, the web app is ready. This page exists to give early access and priority updates to interested shoppers who want to be the first to experience what we've built.",
  },
  {
    question: "Do you deliver nationwide?",
    answer:
      "Delivery details will be shared with subscribers based on location when products go live. We're working to ensure fast and reliable delivery across regions.",
  },
  {
    question: "What about product quality guarantees?",
    answer:
      "Every product undergoes our strict curation process. We verify quality, usefulness, and value before listing. If something doesn't meet our standards, it won't go live.",
  },
  {
    question: "How do returns work?",
    answer:
      "Returns are simple and hassle-free. We want you to shop with confidence. Details about our return policy will be provided during checkout.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      className="m-3 py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="max-w-3xl mx-auto">
        <div className="space-y-12">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-foreground/60">
              Everything you need to know about VendorEase
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-lg border border-border data-[state=open]:border-accent/50 transition-all"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/20 rounded-lg font-semibold text-foreground hover:text-accent transition">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-foreground/70 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
