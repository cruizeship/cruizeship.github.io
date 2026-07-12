import React from "react";
import "./Greeting.scss";
import {greeting, socialMediaLinks} from "../../portfolio";
import placeholderHeadshot from "../../assets/images/placeholder-headshot.svg";
import headshot from "../../assets/images/headshot.png";

const SOCIAL_ICONS = [
  {key: "github", iconClass: "fab fa-github", url: socialMediaLinks.github},
  {key: "linkedin", iconClass: "fab fa-linkedin-in", url: socialMediaLinks.linkedin},
  {
    key: "gmail",
    iconClass: "fas fa-envelope",
    url: socialMediaLinks.gmail ? `mailto:${socialMediaLinks.gmail}` : null
  },
  {key: "medium", iconClass: "fab fa-medium", url: socialMediaLinks.medium}
].filter(s => s.url);

export default function Greeting() {
  if (!greeting.displayGreeting) {
    return null;
  }

  return (
    <section className="lumina-hero lumina-section" id="greeting">
      <div className="lumina-container">
        <div className="lumina-hero-grid">
          <div className="lumina-hero-image-wrap">
            <div className="lumina-hero-image-glow" />
            <div className="lumina-hero-image">
              <img src={headshot} alt="Andrew Cruz" />
            </div>
          </div>

          <div className="lumina-hero-text">
            <h1 className="lumina-display">{greeting.title}</h1>
            <p className="lumina-body-lg lumina-hero-bio">{greeting.subTitle}</p>

            <div className="lumina-hero-ctas">
              <a href="#projects" className="lumina-btn-primary">
                PROJECTS
              </a>
              <a href="#experience" className="lumina-btn-ghost">
                EXPERIENCE
                <span className="material-symbols-outlined lumina-arrow-icon">
                  arrow_forward
                </span>
              </a>
            </div>

            {socialMediaLinks.display && (
              <div className="lumina-hero-social">
                {SOCIAL_ICONS.map(social => (
                  <a
                    key={social.key}
                    href={social.url}
                    className="lumina-social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.key}
                  >
                    <i className={social.iconClass} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
