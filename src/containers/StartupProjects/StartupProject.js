import React from "react";
import "./StartupProjects.scss";
import {bigProjects} from "../../portfolio";
import app1 from "../../assets/images/app.png";
import app2 from "../../assets/images/app2.png";
import app3 from "../../assets/images/app3.png";

export default function StartupProject() {
  function openUrlInNewTab(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!bigProjects.display || bigProjects.projects.length === 0) {
    return null;
  }

  const project = bigProjects.projects[0];
  const projectUrl = project.footerLink && project.footerLink[0]?.url;

  return (
    <section className="lumina-featured-project lumina-section" id="projects">
      <div className="lumina-container">
        <div className="featured-grid scroll-reveal">
          <div className="featured-mockups">
            <div className="phone-frame phone-frame-back">
              <img src={app3} alt="Retune app screenshot" />
            </div>
            <div className="phone-frame phone-frame-middle">
              <img src={app2} alt="Retune app screenshot" />
            </div>
            <div className="phone-frame phone-frame-front">
              <img src={app1} alt="Retune app screenshot" />
            </div>
          </div>

          <div className="featured-card glass-panel">
            <div className="featured-card-header">
              <h3 className="featured-project-name">{project.projectName}</h3>
              <p className="featured-project-tagline lumina-label-mono lumina-accent">
                Your Music, Mapped
              </p>
            </div>

            <p className="lumina-body-md">{project.projectDesc}</p>

            <div className="featured-features">
              <h4 className="featured-features-label">Key Features</h4>
              <ul className="featured-features-list">
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  Location-based Spotify tracking
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  Find trending music near you
                </li>
                <li>
                  <span className="material-symbols-outlined">check_circle</span>
                  Built with UCLA DevX
                </li>
              </ul>
            </div>

            <div className="featured-tags">
              <span className="tech-badge">React Native</span>
              <span className="tech-badge">Swift</span>
              <span className="tech-badge">Express</span>
            </div>

            {projectUrl && (
              <button
                className="lumina-btn-primary featured-cta"
                onClick={() => openUrlInNewTab(projectUrl)}
              >
                VISIT WEBSITE
                <span className="material-symbols-outlined lumina-arrow-icon">
                  arrow_forward
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
