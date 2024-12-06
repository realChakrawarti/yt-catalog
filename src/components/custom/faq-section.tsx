"use client";

import { ChevronDown } from "~/components/custom/icons";
import { useState } from "react";

import { cn } from "~/utils/shadcn-helper";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does YTCatalog's personalized catalog system work?",
    answer:
      "YTCatalog allows you to create custom catalogs for your favorite YouTube channels, tailored to your specific interests. You can organize videos into different categories, making it easier to find and watch the content that matters most to you.",
  },
  {
    question: "How often are the catalogs updated with new content?",
    answer:
      "Our automated system checks for and adds new videos from your selected channels every 4 hours. This ensures you never miss out on the latest content from your favorite creators while maintaining an organized viewing experience.",
  },
  {
    question: "Is YTCatalog available on mobile devices?",
    answer:
      "Yes! YTCatalog is fully mobile-friendly. You can access your curated catalogs on your smartphone or tablet, allowing you to organize and watch your favorite content anytime, anywhere.",
  },
  {
    question: "How does YTCatalog handle user privacy and data security?",
    answer:
      "We prioritize your privacy and implement industry-standard security measures to protect your information. Your viewing habits and personal data are encrypted and never shared with third parties. You have full control over your data and sharing preferences.",
  },
  {
    question: "Can I share my curated catalogs with others?",
    answer:
      "YTCatalog makes it easy to share your curated catalogs with friends and family. This social feature helps others discover new content and creates a collaborative viewing experience while maintaining your privacy settings.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-24 lg:py-32 bg-transparent">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-600 dark:text-neutral-400">
              Everything you need to know about organizing your YouTube
              experience
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-8 space-y-1">
          {faqs.map((faq, index) => (
            <div key={index} className="transition-colors">
              <button
                className="flex w-full items-start justify-between p-6"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="font-medium text-left">{faq.question}</span>
                <span className="font-medium">
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      openIndex === index && "rotate-180"
                    )}
                  />
                </span>
              </button>
              <div
                id={`faq-${index}`}
                className={cn(
                  "overflow-hidden text-neutral-600 dark:text-neutral-400 transition-all duration-200",
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                )}
              >
                <p className="px-6">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
