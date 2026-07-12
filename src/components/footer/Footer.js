import React from "react";
import "./Footer.scss";
import {socialMediaLinks} from "../../portfolio";

const FOOTER_LINKS = [
  {label: "LinkedIn", url: socialMediaLinks.linkedin},
  {label: "Medium", url: socialMediaLinks.medium},
  {label: "GitHub", url: socialMediaLinks.github}
].filter(link => link.url);

export default function Footer() {
  return (
    <footer className="lumina-footer" id="contact">
      <div className="lumina-container lumina-footer-inner">
        <div className="lumina-footer-name">Andrew Cruz</div>
        <p className="lumina-footer-copy">
          &copy; 2026 Andrew Cruz
        </p>
        <div className="lumina-footer-links">
          {FOOTER_LINKS.map(link => (
            <a
              key={link.label}
              href={link.url}
              className="lumina-footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
          {socialMediaLinks.gmail && (
            <a
              href={`mailto:${socialMediaLinks.gmail}`}
              className="lumina-footer-link"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
