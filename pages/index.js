require('dayjs/locale/de')
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.locale('de');

import style from '../style/home.module.scss';
import Header from "../components/Header";
import {Component} from "react";
import {filterRuns, isValidRun, jsonToRuns} from "../helper/functions";
import Subheader from "../components/Subheader";
import LineChart from "../components/graphs/LineChart";
import BestRuns from "../components/runs/BestRuns";
import WeekRuns from "../components/runs/WeekRuns";
import MonthRuns from "../components/runs/MonthRuns";
import YearRuns from "../components/runs/YearRuns";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

class Home extends Component {
    constructor(props) {
        super(props);

        const runs = jsonToRuns(props.json);
        const currentRun = runs[0];

        this.state = {
            runs: runs.reverse(),
            newRun: {
                distance: null,
                duration: null
            },
            currentRun: currentRun,
            graphMode: 'pace',
            runFilter: {
                year: dayjs().year(),
                month: null,
                week: null
            }
        };

        this.deleteRun = this.deleteRun.bind(this);
        this.onChange = this.onChange.bind(this);
        this.insertRun = this.insertRun.bind(this);
        this.changeCurrentRun = this.changeCurrentRun.bind(this);
        this.changeRunFilter = this.changeRunFilter.bind(this);
        this.changeGraphMode = this.changeGraphMode.bind(this);
    }

    onChange(event) {
        let newRun = {};
        if (event.target.name === "distanceInput") {
            newRun.distance = event.target.value;
            newRun.duration = this.state.newRun.duration;
        }
        if (event.target.name === "durationInput") {
            newRun.duration = event.target.value;
            newRun.distance = this.state.newRun.distance;
        }

        this.setState({newRun: newRun});
    }

    changeCurrentRun(run, graphMode) {
        this.setState({
            currentRun: run,
            graphMode: graphMode ? graphMode : this.state.graphMode
        });
    }

    changeGraphMode(graphMode) {
        this.setState({
            graphMode: graphMode
        });
    }

    changeRunFilter(filter) {
        const {year, month, week} = this.state.runFilter;

        /*
        if (year !== filter.year) {
            filter.month = null;
            filter.week = null;
        }

        if (month !== filter.month) {
            filter.week = null;
        }

         */

        this.setState({
            runFilter: {
                year: filter.year === year ? dayjs().year() : filter.year || year,
                month: filter.month === month ? null : filter.month || month,
                week: filter.week === week ? null : filter.week || week
            }
        });
    }

    async insertRun(newRun) {
        if (!isValidRun(newRun)) return;

        let formData = new FormData();
        formData.append('date', dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss'));
        formData.append('distance', String(newRun.distance));
        formData.append('duration', newRun.duration);

        await fetch(process.env.PREACT_APP_API_INSERT_RUN, {
            method: "post",
            body: formData
        })

        //await this.fetchRuns();
    }

    async deleteRun(date) {
        let formData = new FormData();
        formData.append('date', date.format(process.env.PREACT_APP_DB_DATE_FORMAT));

        await fetch(process.env.PREACT_APP_API_DELETE_RUN, {
            method: "post",
            body: formData
        })

        //await this.fetchRuns();
    }

    render() {
        const filteredRuns = filterRuns(this.state.runs, this.state.runFilter);
        
        return <div id="app">
            <Header />
            <Subheader
                currentRun={this.state.currentRun}
                newRun={this.state.newRun}
                onChange={this.onChange}
                onInsert={this.insertRun}
                changeCurrentRun={this.changeCurrentRun}
                graphMode={this.state.graphMode}
            />
            <div className={style.home}>
                <LineChart
                    runs={filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    changeGraphMode={this.changeGraphMode}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                <BestRuns
                    runs={filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                <WeekRuns
                    runs={filterRuns(this.state.runs, {year: this.state.runFilter.year, month: this.state.runFilter.month})}
                    changeRunFilter={this.changeRunFilter}
                    runFilter={this.state.runFilter}
                />
                <MonthRuns
                    runs={filterRuns(this.state.runs, {year: this.state.runFilter.year})}
                    changeRunFilter={this.changeRunFilter}
                    runFilter={this.state.runFilter}
                />
                <YearRuns
                    runs={this.state.runs}
                    changeRunFilter={this.changeRunFilter}
                    runFilter={this.state.runFilter}
                />
            </div>
        </div>
    }
}

export async function getStaticProps(ctx) {
    const json = await prisma.runs.findMany();

    return {
        props: {json: json}
    };
}

export default Home;
