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
            filteredRuns: runs,
            newRun: {
                distance: null,
                duration: null
            },
            currentRun: currentRun,
            graphMode: 'pace',
            filter: {
                year: null,
                month: null,
                week: null
            }
        };

        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.changeCurrentRun = this.changeCurrentRun.bind(this);
        this.changeYearFilter = this.changeYearFilter.bind(this);
        this.changeMonthFilter = this.changeMonthFilter.bind(this);
        this.setFilteredRuns = this.setFilteredRuns.bind(this);
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

    async changeYearFilter(year) {
        if (this.state.filter.year === year) {
            this.setState({
                yearRuns: null,
                monthRuns: null,
                filteredRuns: this.state.runs,
                filter: {
                    year: null,
                    month: null,
                    week: null
                }
            });
        } else {
            const filterYear = dayjs('01-01-' + year);
            const jsonYearRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_YEAR_RUNS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    startOfYear: filterYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
                    endOfYear: filterYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
                }),
            });
            const yearRuns = await jsonYearRuns.json();

            const runs = jsonToRuns(yearRuns);
            this.setState({
                yearRuns: runs,
                filteredRuns: runs,
                filter: {
                    year: year,
                    month: null,
                    week: null
                }
            });
        }
    }

    async changeMonthFilter(month) {
        if (this.state.filter.month === month) {
            this.setState({
                monthRuns: null,
                filteredRuns: this.state.yearRuns,
                filter: {
                    month: null,
                    week: null
                }
            });
        } else {
            const filterMonth = dayjs(month + '-01-' + this.state.filter.year);
            const jsonMonthRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_MONTH_RUNS, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    startOfMonth: filterMonth.startOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
                    endOfMonth: filterMonth.endOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
                }),
            });
            const monthRuns = await jsonMonthRuns.json();

            const runs = jsonToRuns(monthRuns);

            this.setState({
                monthRuns: runs,
                filteredRuns: runs,
                filter: {
                    year: this.state.filter.year,
                    month: month,
                    week: null
                }
            });
        }
    }

    async setFilteredRuns(runs, week) {
        const filterState = this.state.filter
        filterState.week = week;

        this.setState({
            filteredRuns: runs,
            filter: filterState
        });
    }

    render() {
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
                    runs={this.state.filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    changeGraphMode={this.changeGraphMode}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                <BestRuns
                    runs={this.state.filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                {this.state.monthRuns ? <WeekRuns
                    runs={this.state.monthRuns}
                    setFilteredRuns={this.setFilteredRuns}
                    runFilter={this.state.filter}
                />: null}
                {this.state.yearRuns ? <MonthRuns
                    runs={this.state.yearRuns}
                    changeFilter={this.changeMonthFilter}
                    runFilter={this.state.filter}
                />: null}
                <YearRuns
                    runs={this.state.runs}
                    changeFilter={this.changeYearFilter}
                    runFilter={this.state.filter}
                />
            </div>
        </div>
    }
}

export async function getStaticProps(ctx) {
    const jsonRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    const runs = await jsonRuns.json();

    return {
        props: {
            runs: runs
        }
    };
}

export default Home;
