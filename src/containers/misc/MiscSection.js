import React, {useRef, useCallback, useState} from "react";
import "./MiscSection.scss";
import {miscSection} from "../../portfolio";
import contributionsCalendar from "../../data/contributions.json";

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

const GRAPH_WEEKS = 53;

function contributionLevel(count) {
  if (!count) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

/** Always 53 week columns so the panel size never changes. */
function normalizeCalendar(calendar) {
  const sourceWeeks = (calendar && calendar.weeks) || [];
  const weeks = sourceWeeks.slice(0, GRAPH_WEEKS).map(week => ({
    contributionDays: week.contributionDays || []
  }));

  while (weeks.length < GRAPH_WEEKS) {
    weeks.push({contributionDays: []});
  }

  return {
    totalContributions: (calendar && calendar.totalContributions) || 0,
    weeks
  };
}

function Polaroid({polaroid, zIndex, onBringToFront}) {
  const {caption, image} = polaroid;

  const handleActivate = event => {
    onBringToFront();
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
  const weeks = calendar.weeks;
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays && week.contributionDays[0];
    if (!firstDay || !firstDay.date) {
      return;
    }
    const month = new Date(firstDay.date + "T00:00:00").getMonth();
    if (month !== lastMonth) {
      monthLabels.push({label: MONTH_LABELS[month], weekIndex});
      lastMonth = month;
    }
  });

  return (
    <div className="misc-contributions misc-panel scroll-reveal">
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
          style={{"--weeks": GRAPH_WEEKS}}
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
                const dayOfWeek = new Date(day.date + "T00:00:00").getDay();
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

const calendar = normalizeCalendar(contributionsCalendar);

export default function MiscSection() {
  const polaroids = miscSection.polaroids;
  const zIndexCounter = useRef(polaroids.length);
  const [polaroidZIndexes, setPolaroidZIndexes] = useState({});

  const bringToFront = useCallback(index => {
    zIndexCounter.current += 1;
    setPolaroidZIndexes(prev => ({
      ...prev,
      [index]: zIndexCounter.current
    }));
  }, []);

  if (!miscSection.display) {
    return null;
  }

  return (
    <section className="lumina-misc lumina-section" id="about">
      <div className="lumina-container">
        <header className="lumina-misc-header scroll-reveal">
          <h2 className="lumina-display">
            What I've Been <span className="lumina-accent">Up To</span>
          </h2>
        </header>

        <div className="polaroid-canvas scroll-reveal">
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
          <div className="misc-facts scroll-reveal">
            {miscSection.funFacts.map(fact => (
              <div key={fact.label} className="misc-stat misc-panel">
                <span className="misc-stat-value">{fact.value}</span>
                <p className="misc-stat-label">{fact.label}</p>
              </div>
            ))}
          </div>

          <ContributionGraph calendar={calendar} />
        </div>
      </div>
    </section>
  );
}
