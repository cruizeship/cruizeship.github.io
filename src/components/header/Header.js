import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import "./Header.scss";

const NAV_LINKS = [
  {label: "Experience", href: "#experience"},
  {label: "Projects", href: "#projects"},
  {label: "Articles", href: "#articles"}
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const preventScroll = e => {
      if (!e.target.closest(".lumina-header-mobile")) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, {passive: false});
    document.addEventListener("wheel", preventScroll, {passive: false});

    return () => {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("wheel", preventScroll);
    };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  const mobileMenu =
    menuOpen &&
    ReactDOM.createPortal(
      <div
        className="lumina-header-mobile"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="lumina-header-mobile-topbar lumina-container">
          <button
            className="lumina-header-mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="lumina-header-mobile-nav">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="lumina-nav-link"
              onClick={handleNavClick}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#about"
            className="lumina-btn-resume"
            onClick={handleNavClick}
          >
            More
          </a>
        </nav>
      </div>,
      document.body
    );

  return (
    <>
      <nav className="lumina-header">
        <div className="lumina-header-inner lumina-container">
          <a href="/" className="lumina-header-logo" onClick={handleNavClick}>
            Andrew Cruz
          </a>

          <div className="lumina-header-desktop">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="lumina-nav-link">
                {link.label}
              </a>
            ))}
            <a href="#about" className="lumina-btn-resume">
              More
            </a>
          </div>

          <button
            className="lumina-header-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>
      {mobileMenu}
    </>
  );
}

export default Header;
