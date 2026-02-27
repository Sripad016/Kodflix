const navItems = ["Home", "TV Shows", "Movies", "New & Popular", "My List"];

export function Header() {
  return (
    <header className="site-header">
      <div className="brand">KODFLIX</div>
      <nav aria-label="Primary navigation" className="main-nav">
        {navItems.map((item) => (
          <a key={item} href="#" className="nav-link">
            {item}
          </a>
        ))}
      </nav>
      <button className="secondary-btn" type="button">
        Sign In
      </button>
    </header>
  );
}
