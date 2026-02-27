const FOOTER_LINKS = [
  "FAQ",
  "Help Center",
  "Terms of Use",
  "Privacy",
  "Cookie Preferences",
  "Corporate Information",
];

export function Footer() {
  return (
    <footer className="site-footer">
      <p>Questions? Contact support@kodflix.dev</p>
      <div className="footer-links">
        {FOOTER_LINKS.map((link) => (
          <a key={link} href="#">
            {link}
          </a>
        ))}
      </div>
      <p className="footer-note">KodFlix UI demo powered by OMDb API</p>
    </footer>
  );
}
