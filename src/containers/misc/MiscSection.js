import React, {useRef, useCallback, useState, useEffect} from "react";
import "./MiscSection.scss";
import {miscSection} from "../../portfolio";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

function contributionLevel(count) {
  if (!count) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function Polaroid({polaroid, zIndex, onBringToFront}) {
  const {caption, image} = polaroid;

  const handleActivate = event => {
    onBringToFront();
    // Drop sticky focus ring after tap on mobile
    if (event.currentTarget && event.currentTarget.blur) {
      event.currentTarget.blur();
    }
  };

  return (
    <button
      type="button"
      className="polaroid"
      style={{zIndex}}
      onClick={handleActivate}
      onMouseEnter={onBringToFront}
      onTouchStart={onBringToFront}
      aria-label={caption}
    >
      <img src={image} alt={caption} draggable="false" />
    </button>
  );
}

function ContributionGraph({calendar}) {
  if (!calendar || !calendar.weeks || !calendar.weeks.length) {
    return (
      <div className="misc-contributions misc-panel">
        <p className="misc-contributions-empty">
          Contribution data unavailable. Run fetch.js with GitHub env vars set.
        </p>
      </div>
    );
  }

  const weeks = calendar.weeks;
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays && week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      monthLabels.push({label: MONTH_LABELS[month], weekIndex});
      lastMonth = month;
    }
  });

  return (
    <div className="misc-contributions misc-panel">
      <div className="misc-contributions-header">
        <h3 className="misc-contributions-title">Contribution Graph</h3>
        <span className="misc-contributions-total">
          {calendar.totalContributions.toLocaleString()} contributions in the
          last year
        </span>
      </div>

      <div className="misc-contributions-scroll">
        <div
          className="misc-contributions-inner"
          style={{"--weeks": weeks.length}}
        >
          <div className="misc-contributions-months">
            {monthLabels.map(({label, weekIndex}) => (
              <span
                key={`${label}-${weekIndex}`}
                className="misc-contributions-month"
                style={{gridColumn: weekIndex + 1}}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="misc-contributions-grid">
            {weeks.map((week, weekIndex) =>
              (week.contributionDays || []).map(day => {
                const level = contributionLevel(day.contributionCount);
                const dayOfWeek = new Date(
                  day.date + "T00:00:00"
                ).getDay();
                return (
                  <div
                    key={day.date}
                    className={`misc-contrib-cell level-${level}`}
                    style={{
                      gridColumn: weekIndex + 1,
                      gridRow: dayOfWeek + 1
                    }}
                    title={`${day.contributionCount} contribution${
                      day.contributionCount === 1 ? "" : "s"
                    } on ${day.date}`}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="misc-contributions-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div
            key={level}
            className={`misc-contrib-cell level-${level}`}
            aria-hidden="true"
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function MiscSection() {
  const polaroids = miscSection.polaroids;
  const zIndexCounter = useRef(polaroids.length);
  const [polaroidZIndexes, setPolaroidZIndexes] = useState({});
  const [calendar, setCalendar] = useState(null);
  const [calendarLoaded, setCalendarLoaded] = useState(false);

  const bringToFront = useCallback(index => {
    zIndexCounter.current += 1;
    setPolaroidZIndexes(prev => ({
      ...prev,
      [index]: zIndexCounter.current
    }));
  }, []);

  useEffect(() => {
    fetch("/contributions.json")
      .then(result => {
        if (!result.ok) {
          throw new Error(`HTTP ${result.status}`);
        }
        return result.json();
      })
      .then(data => {
        setCalendar(data);
        setCalendarLoaded(true);
      })
      .catch(() => {
        setCalendar(null);
        setCalendarLoaded(true);
      });
  }, []);

  if (!miscSection.display) {
    return null;
  }

  return (
    <section className="lumina-misc lumina-section" id="about">
      <div className="lumina-container">
        <header className="lumina-misc-header">
          <h2 className="lumina-display">
            More From <span className="lumina-accent">Me</span>
          </h2>
        </header>

        <div className="polaroid-canvas">
          {polaroids.map((polaroid, i) => (
            <Polaroid
              key={i}
              polaroid={polaroid}
              zIndex={
                polaroidZIndexes[i] != null
                  ? polaroidZIndexes[i]
                  : polaroids.length - i
              }
              onBringToFront={() => bringToFront(i)}
            />
          ))}
        </div>

        <div className="misc-widgets">
          <div className="misc-facts">
            {miscSection.funFacts.map(fact => (
              <div key={fact.label} className="misc-stat misc-panel">
                <span className="misc-stat-value">{fact.value}</span>
                <p className="misc-stat-label">{fact.label}</p>
              </div>
            ))}
          </div>

          {calendarLoaded && <ContributionGraph calendar={calendar} />}
        </div>
      </div>
    </section>
  );
}
