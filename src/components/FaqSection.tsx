import { useState } from "react";

const QUESTIONS = [
  {
    question: "What is KodFlix?",
    answer:
      "KodFlix is a Netflix-inspired UI powered by real-time OMDb data. It is a frontend demo for browsing movie rails.",
  },
  {
    question: "Where does the movie data come from?",
    answer:
      "Movie cards and hero data are fetched from the OMDb API using your configured API key in the app environment.",
  },
  {
    question: "Can I watch these movies here?",
    answer:
      "No. This app is a browsing interface demo only, and does not provide video streaming playback.",
  },
  {
    question: "Is this responsive on mobile?",
    answer:
      "Yes. The layout is mobile-first with adaptive hero text, scrollable rails, and accessible controls.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section" aria-label="Frequently asked questions">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {QUESTIONS.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <article className="faq-item" key={item.question}>
              <button
                className="faq-question"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
              </button>
              {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
