/* MIT License
 *
 * Copyright (c) 2022 Mike Chambers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { useContext } from "react";
import LoadingAnimationView from "../../components/LoadingAnimationView";
import PageSectionView from "../../components/PageSectionView";
import ScreenNavigationView from "../../components/ScreenNavigationView";
import { GlobalContext } from "../../contexts/GlobalContext";
import { useFetchPlayerMetrics } from "../../hooks/remote";
import AllTimeLeaderView from "./components/AllTimeLeaderView";
import SeasonLeaderView from "./components/SeasonLeaderView";
import WeeklyLeaderView from "./components/WeeklyLeaderView";

const pageContainerStyle = {
    //minWidth: "720px",
    width: "100%",
};

const gappedStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
};

const HomeView = (props) => {
    const { global, dispatchGlobal } = useContext(GlobalContext);
    const players = global.players;

    const [metrics, isMetricsLoading, isMetricsError] =
        useFetchPlayerMetrics(players);

    const pageLinks = [
        {
            value: "Weekly",
            id: "weekly",
        },
        {
            value: "Season",
            id: "season",
        },
        {
            value: "All Time",
            id: "all_time",
        },
    ];

    if (isMetricsLoading) {
        return <LoadingAnimationView message="Loading leaderboard data." />;
    }

    return (
        <div
            id="page_nav"
            className="page_containter"
            style={pageContainerStyle}
        >
            <div style={gappedStyle}>
                <ScreenNavigationView links={pageLinks} />

                <PageSectionView
                    id="weekly"
                    title="Weekly Leaderboards"
                    description="Weejkly Crucible Leaderboards."
                />
                <WeeklyLeaderView metrics={metrics} />

                <PageSectionView
                    id="season"
                    title="Season Leaderboards"
                    description="Season Leaderboard."
                />
                <SeasonLeaderView metrics={metrics} />

                <PageSectionView
                    id="all_time"
                    title="All Time Leaderboards"
                    description="All Time Leaderboards."
                />
                <AllTimeLeaderView metrics={metrics} />
            </div>
        </div>
    );
};

export default HomeView;
