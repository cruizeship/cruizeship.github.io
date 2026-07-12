import React from "react";
import "./ExperienceEducation.scss";
import {workExperiences, educationInfo} from "../../portfolio";

function TimelineItem({experience, isFirst}) {
  return (
    <div className={`timeline-item ${isFirst ? "timeline-item-active" : ""}`}>
      <div className="timeline-dot" />
      <div className="timeline-content">
        <div className="timeline-header">
          <div className="timeline-company">
            <div className="timeline-logo">
              <img src={experience.companylogo} alt={`${experience.company} logo`} />
            </div>
            <h3 className="timeline-company-name">{experience.company}</h3>
          </div>
          <span className="timeline-date">{experience.date}</span>
        </div>
        <p className="timeline-role">{experience.role}</p>
        <p className="timeline-team">{experience.desc}</p>
        {experience.descBullets && experience.descBullets.length > 0 && (
          <ul className="timeline-bullets">
            {experience.descBullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function parseActivityChips(school) {
  const chips = [];

  [school.desc, school.desc2].filter(Boolean).forEach(entry => {
    const activitiesMatch = entry.match(/^Activities:\s*(.+)$/i);
    if (!activitiesMatch) return;

    activitiesMatch[1]
      .split(",")
      .map(item => item.trim())
      .filter(Boolean)
      .forEach(item => chips.push(item));
  });

  return chips;
}

function EducationEntry({school, variant, isFirst}) {
  const activities = parseActivityChips(school);

  return (
    <div className="edu-entry">
      {!isFirst && <div className="edu-divider" aria-hidden="true" />}
      <div className="edu-school">
        <div className="edu-school-top">
          <div className="edu-logo">
            <img src={school.logo} alt={`${school.schoolName} logo`} />
          </div>
          <span className={`edu-year-badge edu-year-badge--${variant}`}>
            {school.duration}
          </span>
        </div>

        <div className="edu-school-heading">
          <h3 className="timeline-company-name">{school.schoolName}</h3>
          {school.subHeader && <p className="timeline-team">{school.subHeader}</p>}
        </div>

        {activities.length > 0 && (
          <div className="edu-activity-chips">
            {activities.map(activity => (
              <span
                key={activity}
                className={`edu-activity-chip edu-activity-chip--${variant}`}
              >
                {activity}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExperienceEducation() {
  if (!workExperiences.display && !educationInfo.display) {
    return null;
  }

  return (
    <section className="lumina-section" id="experience">
      <div className="lumina-container exp-edu-grid">
        {workExperiences.display && (
          <div className="exp-column scroll-reveal">
            <h2 className="lumina-headline exp-edu-heading">Experience</h2>
            <div className="timeline">
              {workExperiences.experience.map((exp, i) => (
                <TimelineItem key={i} experience={exp} isFirst={i === 0} />
              ))}
            </div>
          </div>
        )}

        {educationInfo.display && (
          <div className="edu-column scroll-reveal">
            <h2 className="lumina-headline exp-edu-heading">Education</h2>

            <div className="edu-card glass-panel">
              {educationInfo.schools.map((school, i) => (
                <EducationEntry
                  key={school.schoolName}
                  school={school}
                  variant={i === 0 ? "primary" : "muted"}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
