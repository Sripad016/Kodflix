const FEATURES = [
  {
    title: "Enjoy on your TV",
    description:
      "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
  },
  {
    title: "Download your shows to watch offline",
    description:
      "Save your favorites easily and always have something to watch on the go.",
  },
  {
    title: "Create profiles for kids",
    description:
      "Send kids on adventures with their favorite characters in a space made just for them.",
  },
];

export function FeatureBands() {
  return (
    <section className="feature-grid" aria-label="Feature highlights">
      {FEATURES.map((feature) => (
        <article className="feature-card" key={feature.title}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </section>
  );
}
