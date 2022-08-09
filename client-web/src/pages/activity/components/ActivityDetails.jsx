import { DateTime, Interval } from "luxon";
import { humanDuration } from "../../../utils/date";
import { capitalize } from "../../../utils/string";

const scoreStyle = {
  padding: "var(--content-padding)",
  height: "33%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
};

const spacerContainerStyle = {
  height: "50%",
};

const gameInfoContainterStyle = {
  height: "25%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-apart",
  alignItems: "flex-end",

  backgroundColor: "#00000044",
  padding: "var(--content-padding)",
};

const gameInfoStyle = {
  width: "60%",
};

const matchTimeStyle = {
  width: "40%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "flex-end",
};

const modeMapContainerStyle = {
  display: "flex",
  flexDirection: "columns",
  alignItems: "center",
};

const mapNameStyle = {
  font: "var(--font-activity-map-name)",
};

const modeNameStyle = {
  font: "var(--font-activity-mode-name)",
  textTransform: "uppercase",
};

const dividerStyle = {
  margin: 0,
};

const periodStyle = {
  font: "var(--font-activity-period)",
  textShadow: "var(--text-shadow)",
};

const teamScoresStyle = {
  display: "flex",
  flexDirection: "rows",
  gap: "10px",
};

const scoreBoxStyle = {
  width: 60,
  height: 30,
  border: "1px solid #ffffff88",
  font: "var(--font-activity-score-box)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const scoreDivider = {
  borderColor: "#ffffff",
  borderStyle: "solid",
  borderWidth: "0px 1px 0px 0px",
};

const completionReasonStyle = {
  font: "var(--font-activity-completion-reason)",
  textTransform: "uppercase",
};

const summaryStyleBase = {
  width: 700,
  height: 400,

  backgroundSize: "cover",

  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "space-apart",
};

const modeIconStyleBase = {
  width: 70,
  height: 70,
  backgroundSize: "cover",
};

const ActivityDetails = (props) => {
  const details = props.details;
  const teams = props.teams;

  const summaryStyle = {
    ...summaryStyleBase,
    backgroundImage: `url(${details.map.image})`,
  };

  let modeIconStyle = {
    ...modeIconStyleBase,
    backgroundImage: `url(${details.modeInfo.icon})`,
  };

  let alphaTeam = teams[0];
  let betaTeam = teams[1];

  //todo: change based on time
  let period = DateTime.fromJSDate(details.period);
  let now = DateTime.now();
  let diff = Interval.fromDateTimes(period, now).length("days");
  let periodHuman;
  if (diff < 2) {
    periodHuman = `${capitalize(
      period.toRelativeCalendar()
    )} at ${period.toFormat("t")}`;
  } else if (diff < 7) {
    periodHuman = period.toFormat("EEEE, LLLL d 'at' t");
  } else if (period.get("year") !== now.get("year")) {
    periodHuman = period.toFormat("LLLL d, kkkk 'at' t");
  } else {
    periodHuman = period.toFormat("LLLL d 'at' t");
  }

  const activityDuration = humanDuration(
    details.activityDurationSeconds * 1000
  );

  return (
    <div style={summaryStyle}>
      <div style={scoreStyle}>
        <div style={completionReasonStyle}>
          {details.completionReason.label}
        </div>
        <div style={teamScoresStyle}>
          <div className="alpha" style={scoreBoxStyle}>
            {alphaTeam.score}
          </div>
          <div style={scoreDivider}></div>
          <div className="bravo" style={scoreBoxStyle}>
            {betaTeam.score}
          </div>
        </div>
        <div>{activityDuration}</div>
      </div>
      <div style={spacerContainerStyle}></div>
      <div style={gameInfoContainterStyle}>
        <div style={gameInfoStyle}>
          <div style={modeMapContainerStyle}>
            <div style={modeIconStyle}></div>
            <div className="activity_mode_name">
              <div className="activity_map_name">{details.map.name}</div>
              <div>
                <hr style={dividerStyle} />
              </div>
              <div style={modeNameStyle}>{details.modeInfo.name}</div>
            </div>
          </div>
        </div>
        <div style={matchTimeStyle}>
          <div style={periodStyle}>{periodHuman}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
