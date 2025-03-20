"use client";

import Linkify from "linkify-react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "~/shared/lib/tailwind-merge";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What can I do with YTCatalog?",
    answer:
      "YTCatalog lets you create personalized collections of YouTube content. Instead of just subscribing to channels, you can build custom catalogs tailored to your interests. This makes it much easier to find exactly the videos you want to watch, when you want to watch them.",
  },
  {
    question: "How do I use YTCatalog to organize my YouTube content?",
    answer:
      "It's simple! You select the YouTube channels you like, and you can even choose specific playlists from those channels for finer-grained control. YTCatalog then automatically adds new videos to your curated catalogs, so you don't miss anything. Think of it as your own personalized TV guide for YouTube!",
  },
  {
    question: "How often are new videos added to my catalogs?",
    answer:
      "YTCatalog checks for new videos from your selected channels and playlists every 4 hours, so your catalogs are always up-to-date.",
  },
  {
    question: "Can I use YTCatalog on my phone or tablet?",
    answer:
      "Yes, YTCatalog is designed to work seamlessly on mobile devices. Access your catalogs from your smartphone or tablet anytime, anywhere.",
  },
  {
    question: "How secure is my data on YTCatalog?",
    answer:
      "We take your privacy seriously. Your viewing history and personal data are encrypted and never shared with anyone. You have full control over your data.",
  },
  {
    question: "Can I share my catalogs with friends?",
    answer:
      "Yes, you can easily share your curated catalogs with friends and family, allowing them to discover great content too. Your privacy settings remain in control.",
  },
  {
    question: "Can I download videos anonymously?",
    answer:
      "Yes, you can download videos anonymously using the privacy-focused cobalt.tools website. This allows you to save videos without revealing your identity or browsing history.",
  },
  {
    question: "Is YTCatalog open source?",
    answer:
      "Yes! YTCatalog is completely open source and is hosted on GitHub. You can view the code, contribute to the project, or even host your own version.  Check it out here: https://github.com/realChakrawarti/yt-catalog.",
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
                  <ChevronDownIcon
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
                <p className="px-6">
                  <Linkify
                    options={{
                      target: "_blank",
                      className:
                        "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
                    }}
                  >
                    {faq.answer}
                  </Linkify>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
