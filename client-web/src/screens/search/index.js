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

import { useContext, useEffect, useState } from "react";
import { Mode, Moment, OrderBy } from "shared";
import CharacterClassSelectionSelect from "../../components/CharacterClassSelectionSelect";
import ModeSelect from "../../components/ModeSelect";
import MomentSelect from "../../components/MomentSelect";
import OrderBySelect from "../../components/OrderBySelect";
import PlayerSelect from "../../components/PlayerSelect";
import SeasonSelect from "../../components/SeasonSelect";
import { GlobalContext } from "../../contexts/GlobalContext";
import { CURRENT_SEASON, MOMENT_TYPE, SEASON_TYPE } from "../../core/consts";
import { createPlayerUrl } from "../../core/utils";
import { useNavigate } from "react-router-dom";
import CharacterClassSelection from "shared/packages/enums/CharacterClassSelection";

const pageContainerStyle = {
    //minWidth: "720px",
    width: "100%",
};

const gappedStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    //width: "250px",
    width: "min-content",
};

const formContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
};

const formSectionStyle = {
    display: "flex",
    gap: "16px",
};

const periodContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "16px",
};

const SearchView = (props) => {
    const { global, dispatchGlobal } = useContext(GlobalContext);
    const players = global.players;

    const [player, setPlayer] = useState();
    const [characterClass, setCharacterClass] = useState(
        CharacterClassSelection.ALL
    );
    const [mode, setMode] = useState(Mode.ALL_PVP);
    const [startMoment, setStartMoment] = useState(CURRENT_SEASON.startMoment);
    const [endMoment, setEndMoment] = useState(Moment.NOW);
    const [season, setSeason] = useState(CURRENT_SEASON);
    const [orderBy, setOrderBy] = useState(OrderBy.PERIOD);

    const [periodType, setPeriodType] = useState(MOMENT_TYPE);

    const [validationMessage, setValidationMessage] = useState();

    let navigate = useNavigate();

    useEffect(() => {
        if (players && players.length) {
            setPlayer(players[0]);
        }
    }, [players]);

    const onPlayerSelectChange = function (p) {
        setPlayer(p);
    };

    const onClassSelectChange = function (c) {
        setCharacterClass(c);
    };

    const onModeSelectChange = function (m) {
        setMode(m);
    };

    const onStartMomentSelectChange = function (m) {
        setStartMoment(m);
    };

    const onEndMomentSelectChange = function (m) {
        setEndMoment(m);
    };

    const onOrderBySelectChange = function (m) {
        setOrderBy(m);
    };

    const onSeasonSelectChange = function (m) {
        setSeason(m);
    };

    const onPeriodClick = function (periodType) {
        setPeriodType(periodType);
    };

    const validate = function () {
        //only need to validate right now if period is set to MOMENT_TYPE
        if (getMomentType() !== MOMENT_TYPE) {
            return true;
        }

        if (endMoment.getDate() > startMoment.getDate()) {
            return true;
        }

        //update message

        setValidationMessage("Start Moment must be before End Moment");

        return false;
    };

    const getMomentType = function () {
        let momentType = document.getElementById("moment_radio").checked
            ? MOMENT_TYPE
            : SEASON_TYPE;

        return momentType;
    };

    const onSearchClick = function () {
        if (!validate()) {
            return;
        }

        let momentType = getMomentType();

        let url = createPlayerUrl({
            player,
            characterClass,
            mode,
            momentType,
            startMoment,
            endMoment,
            season,
            orderBy,
        });

        navigate(url);
    };

    return (
        <div
            id="page_nav"
            className="page_containter"
            style={pageContainerStyle}
        >
            <div style={gappedStyle}>
                <div style={formContainerStyle}>
                    <div style={formSectionStyle}>
                        <PlayerSelect
                            label="player"
                            onChange={onPlayerSelectChange}
                            players={players}
                        />
                        <CharacterClassSelectionSelect
                            label="class"
                            onChange={onClassSelectChange}
                            selected={CharacterClassSelection.ALL}
                        />
                    </div>

                    <ModeSelect
                        label="Mode"
                        onChange={onModeSelectChange}
                        selected={Mode.ALL_PVP}
                    />

                    <fieldset style={periodContainerStyle}>
                        <legend>Period</legend>
                        <div style={formSectionStyle}>
                            <div>
                                <input
                                    type="radio"
                                    value={MOMENT_TYPE}
                                    name="period"
                                    id="moment_radio"
                                    onClick={(e) => {
                                        onPeriodClick(e.target.value);
                                    }}
                                    defaultChecked={periodType === MOMENT_TYPE}
                                />
                                <label htmlFor="moment_radio">Moments</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    value={SEASON_TYPE}
                                    name="period"
                                    id="season_radio"
                                    onClick={(e) => {
                                        onPeriodClick(e.target.value);
                                    }}
                                    defaultChecked={periodType === SEASON_TYPE}
                                />
                                <label htmlFor="season_radio">Season</label>
                            </div>
                        </div>
                        <div style={formSectionStyle}>
                            <MomentSelect
                                label="Start Moment"
                                onChange={onStartMomentSelectChange}
                                selected={CURRENT_SEASON.startMoment}
                                disabled={periodType !== MOMENT_TYPE}
                            />
                            <MomentSelect
                                label="End Moment"
                                onChange={onEndMomentSelectChange}
                                selected={Moment.NOW}
                                disabled={periodType !== MOMENT_TYPE}
                            />
                        </div>

                        <div style={formSectionStyle}>
                            <SeasonSelect
                                label="Season"
                                selected={CURRENT_SEASON}
                                onChange={onSeasonSelectChange}
                                disabled={periodType !== SEASON_TYPE}
                            />
                        </div>
                    </fieldset>
                    <div style={formSectionStyle}>
                        <OrderBySelect
                            label="Sort By"
                            selected={OrderBy.PERIOD}
                            onChange={onOrderBySelectChange}
                        />
                    </div>
                    <button onClick={onSearchClick}>View</button>
                    <div className="form_validation_msg">
                        {validationMessage}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchView;
