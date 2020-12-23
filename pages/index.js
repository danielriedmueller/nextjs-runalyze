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
import {filterRuns, isValidRun, jsonToRun, jsonToRuns} from "../helper/functions";
import Subheader from "../components/Subheader";
import LineChart from "../components/graphs/LineChart";
import BestRuns from "../components/runs/BestRuns";
import WeekRuns from "../components/runs/WeekRuns";
import MonthRuns from "../components/runs/MonthRuns";
import YearRuns from "../components/runs/YearRuns";
import { PrismaClient } from "@prisma/client"

class Home extends Component {
    constructor(props) {
        super(props);

        const runs = jsonToRuns(props.runs);
        const currentRun = runs[0];

        this.state = {
            runs: runs,
            yearRuns: jsonToRuns(props.yearRuns),
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

        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.changeCurrentRun = this.changeCurrentRun.bind(this);
        this.changeRunFilter = this.changeRunFilter.bind(this);
        this.changeGraphMode = this.changeGraphMode.bind(this);
    }

    async fetchAll() {
        const res = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
        const runs = await res.json();
        return jsonToRuns(runs);
    }

    async onChange(run) {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_UPDATE_RUN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(run),
            })

            const jsonRun = await res.json();
            const runs = await this.fetchAll();

            this.setState({
                runs: runs,
                currentRun: jsonToRun(jsonRun)
            });
        } catch (error) {
            console.error(error)
        }
    }

    async onDelete(id) {
        try {
            await fetch(process.env.NEXT_PUBLIC_API_DELETE_RUN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(id),
            })

            const runs = await this.fetchAll();
            const currentRun = runs[0];

            this.setState({
                currentRun: currentRun,
                runs: runs
            });
        } catch (error) {
            console.error(error)
        }
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

    render() {
        const filteredRuns = filterRuns(this.state.runs, this.state.runFilter);

        return <div id="app">
            <Header />
            <Subheader
                currentRun={this.state.currentRun}
                newRun={this.state.newRun}
                onChange={this.onChange}
                onDeleteRun={this.onDelete}
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
                <MonthRuns
                    runs={this.state.yearRuns}
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
    const jsonRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    const runs = await jsonRuns.json();
    const currentYear = dayjs(runs[0].date);

    const jsonYearRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_YEAR_RUNS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            startOfYear: currentYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            endOfYear: currentYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const yearRuns = await jsonYearRuns.json();

    const jsonMonthRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_YEAR_RUNS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            startOfYear: currentYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            endOfYear: currentYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const month = await jsonMonthRuns.json();

    return {
        props: {
            runs: runs,
            yearRuns: yearRuns,
            monthRuns: monthRuns
        }
    };
}

export default Home;
