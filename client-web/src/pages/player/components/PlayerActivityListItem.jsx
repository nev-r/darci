import { useState } from "react";
import PlayerActivityDetail from "./PlayerAcitivtyDetail";
import Stat from "./Stat";
import { useNavigate } from "react-router-dom";

import { ReactComponent as ChevronRight } from "../../../components/images/tabler/chevron-right.svg";
import { SMALL } from "../../../components/Medal";
import PlayerStatusView from "./PlayerStatusView";
import ActivityCompletionReasonView from "./ActivityCompletionReasonView";
import MedalsList from "./MedalsList";
import { Standing } from "shared";

const resultWinStyle = {
  backgroundColor: "#3FD445",
  //width: "6px",
  borderRadius: "var(--border-radius) 0px 0px var(--border-radius)",
};

const resultLossStyle = {
  backgroundColor: "#E92626",
  //width: "6px",
  borderRadius: "var(--border-radius) 0px 0px var(--border-radius)",
};

const statsStyle = {
  //display: "flex",
  //flexDirection: "row",
  //justifyContent: "space-between",
  //width: "450px",

  alignItems: "center",

  display: "grid",
  gridTemplateColumns: "repeat(6, 50px)",
  columnGap: "var(--stat-item-gap)",
};

//todo: remove this here or in parent

const gameContainerStyle = {
  //display: "flex",
  //flexDirection: "row",

  height: "46px",

  //borderLeftWidth: "0px",

  display: "grid",
  gridTemplateColumns: "6px 170px 400px 39px 75px 10px",
  flexDirection: "row",

  cursor: "pointer",
};

const gameTitleStyle = {
  display: "flex",
  flexDirection: "column",
  //width: "160px",
  justifyContent: "center",
  paddingLeft: "4px",
};

const gameContainerWrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const statusStyleWrapper = {
  //width: "35px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const mercyStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
};

const statusStyle = {
  display: "flex",

  alignItems: "flex-end",
};

const medalsStyle = {
  //width: "60px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
};

const gameDetailNavStyle = {
  backgroundColor: "#FFFFFFee",
  width: "10px",
  borderRadius: "0px var(--border-radius) var(--border-radius) 0px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const chevronIconStyle = {
  color: "#000000",
  width: 16,
  height: 16,
};

const PlayerActivityListItem = (props) => {
  let activity = props.activity;
  let summary = props.summary;

  let navigate = useNavigate();

  const onGameDetailNavClick = (e, activityId) => {
    e.stopPropagation();
    navigate(`/activity/${activityId}`);
  };

  let resultStyle =
    activity.stats.standing === Standing.VICTORY
      ? resultWinStyle
      : resultLossStyle;

  let gm = new Map();
  for (let m of activity.stats.extended.medals) {
    if (m.info.isGold) {
      gm.set(m.id, m);
    }
  }

  let goldMedals = Array.from(gm.values());

  if (goldMedals.length > 6) {
    goldMedals = goldMedals.slice(0, 5);
  }

  let title = "Highest Value";
  let killsHighlight = activity.stats.kills === summary.highestKills;
  let killsTitle = killsHighlight ? title : "";

  let assistsHighlight = activity.stats.assists === summary.highestAssists;
  let assistsTitle = assistsHighlight ? title : "";

  let defeatsHighlight =
    activity.stats.opponentsDefeated === summary.highestOpponentsDefeated;
  let defeatsTitle = defeatsHighlight ? title : "";

  let deathsHighlight = activity.stats.deaths === summary.highestDeaths;
  let deathsTitle = deathsHighlight ? title : "";

  let kdHighlight =
    activity.stats.killsDeathsRatio.toFixed(2) ===
    summary.highestKillsDeathsRatio.toFixed(2);
  let kdTitle = kdHighlight ? title : "";

  let effHighlight =
    activity.stats.efficiency.toFixed(2) ===
    summary.highestEfficiency.toFixed(2);
  let effTitle = effHighlight ? title : "";

  let [isExpanded, setIsExpanded] = useState(
    props.expanded === undefined ? false : props.expanded
  );

  const onItemClick = function (e) {
    setIsExpanded(!isExpanded);
  };

  let detailsDiv = isExpanded ? (
    <PlayerActivityDetail activity={activity} />
  ) : (
    ""
  );

  return (
    <div style={gameContainerWrapper}>
      <div
        className="list_item_header"
        style={gameContainerStyle}
        onClick={onItemClick}
      >
        <div style={resultStyle}></div>
        <div style={gameTitleStyle}>
          <div className="subsection_header">{activity.activity.map.name}</div>
          <div className="list_subtitle">{activity.activity.mode.label}</div>
        </div>

        <div style={statsStyle}>
          <Stat
            label="kills"
            value={activity.stats.kills}
            highlight={killsHighlight}
            title={killsTitle}
          />
          <Stat
            label="assists"
            value={activity.stats.assists}
            highlight={assistsHighlight}
            title={assistsTitle}
          />
          <Stat
            label="defeats"
            value={activity.stats.opponentsDefeated}
            highlight={defeatsHighlight}
            title={defeatsTitle}
          />
          <Stat
            label="deaths"
            value={activity.stats.deaths}
            highlight={deathsHighlight}
            title={deathsTitle}
          />
          <Stat
            label="kd"
            value={activity.stats.killsDeathsRatio.toFixed(2)}
            highlight={kdHighlight}
            title={kdTitle}
          />
          <Stat
            label="eff"
            value={activity.stats.efficiency.toFixed(2)}
            highlight={effHighlight}
            title={effTitle}
          />
        </div>

        <div style={statusStyleWrapper}>
          <div style={statusStyle}>
            <PlayerStatusView
              completed={activity.stats.completed}
              joinedLate={activity.stats.joinedLate}
            />
          </div>
          <div style={mercyStyle}>
            <ActivityCompletionReasonView
              completionReason={activity.stats.completionReason}
            />
          </div>
        </div>

        <div style={medalsStyle}>
          <MedalsList medals={goldMedals} size={SMALL} />
        </div>
        <div
          style={gameDetailNavStyle}
          onClick={(e) => onGameDetailNavClick(e, activity.activity.activityId)}
        >
          <ChevronRight style={chevronIconStyle} />
        </div>
      </div>
      {detailsDiv}
    </div>
  );
};

export default PlayerActivityListItem;
