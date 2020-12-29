require('dayjs/locale/de')
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import style from '../style/home.module.scss';
import Header from "../components/Header";
import {Component} from "react";
import {isValidRun, jsonToRun, jsonToRuns} from "../helper/functions";
import Subheader from "../components/Subheader";
import LineChart from "../components/graphs/LineChart";
import BestRuns from "../components/runs/BestRuns";
import WeekRuns from "../components/runs/WeekRuns";
import MonthRuns from "../components/runs/MonthRuns";
import YearRuns from "../components/runs/YearRuns";

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.locale('de');

class Home extends Component {
    constructor(props) {
        super(props);

        const runs = jsonToRuns(props.runs);
        const currentRun = runs[0];

        this.state = {
            runs,
            newRun: {
                distance: null,
                duration: null
            },
            currentRun,
            graphMode: 'pace',
            filter: {
                year: null,
                month: null,
                week: null
            },
            filteredRuns: {
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
        this.changeWeekFilter = this.changeWeekFilter.bind(this);
        this.updateFilteredRuns = this.updateFilteredRuns.bind(this);
        this.changeGraphMode = this.changeGraphMode.bind(this);
    }

    async fetchAll() {
        const res = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
        const runs = await res.json();
        return jsonToRuns(runs);
    }

    async onChange(run) {
        if (isValidRun(run)) {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_API_UPSERT_RUN, {
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
    }

    async onDelete(id) {
        try {
            await fetch(process.env.NEXT_PUBLIC_API_DELETE_RUN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id}),
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
        const filter = (this.state.filter.year === year) ? {
            year: null,
            month: null,
            week: null
        } : {
            year: year,
            month: null,
            week: null
        }

        await this.updateFilteredRuns(filter);
    }

    async changeMonthFilter(month) {
        const filter = (this.state.filter.month === month) ? {
            year: this.state.filter.year,
            month: null,
            week: null
        } : {
            year: this.state.filter.year,
            month: month,
            week: null
        }

        await this.updateFilteredRuns(filter);
    }

    async changeWeekFilter(week) {
        let stateFilter = this.state.filter;
        stateFilter.week === week ? stateFilter.week = null : stateFilter.week = week

        await this.updateFilteredRuns(stateFilter);
    }

    async updateFilteredRuns(filter) {
        const {year, month, week} = filter;

        let startDate = null;
        let endDate = null;

        const filteredRuns = this.state.filteredRuns;
        let dateRange = null;

        if (week && month && year) {
            dateRange = 'week';
            const filterDate = dayjs(month + '-01-' + year).week(week);
            startDate = filterDate.startOf(dateRange);
            endDate = filterDate.endOf(dateRange);
        } else if (month && year) {
            dateRange = 'month';
            const filterDate = dayjs(month + '-01-' + year);
            startDate = filterDate.startOf(dateRange);
            endDate = filterDate.endOf(dateRange);
            filteredRuns.week = null;
        } else if (year) {
            dateRange = 'year';
            const filterDate = dayjs('01-01-' + year);
            startDate = filterDate.startOf(dateRange);
            endDate = filterDate.endOf(dateRange);
            filteredRuns.month = null;
            filteredRuns.week = null;
        } else {
            filteredRuns.year = null
            filteredRuns.month = null;
            filteredRuns.week = null;
        }

        if (startDate && endDate) {
            const dbResult = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    start: startDate.format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
                    end: endDate.format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
                }),
            });

            const jsonRuns = await dbResult.json();
            filteredRuns[dateRange] = jsonToRuns(jsonRuns);
        }

        this.setState({filter, filteredRuns});
    }

    getFilteredRuns() {
        const {year, month, week} = this.state.filter;

        if (week) {
            return this.state.filteredRuns.week;
        }

        if (month) {
            return this.state.filteredRuns.month;
        }

        if (year) {
            return this.state.filteredRuns.year;
        }

        return this.state.runs;
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
                <BestRuns
                    runs={this.getFilteredRuns()}
                    changeCurrentRun={this.changeCurrentRun}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                <LineChart
                    runs={this.getFilteredRuns()}
                    changeCurrentRun={this.changeCurrentRun}
                    changeGraphMode={this.changeGraphMode}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                {this.state.filteredRuns.month ? <WeekRuns
                    runs={this.state.filteredRuns.month}
                    changeFilter={this.changeWeekFilter}
                    runFilter={this.state.filter}
                />: null}
                {this.state.filteredRuns.year ? <MonthRuns
                    runs={this.state.filteredRuns.year}
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

export async function getServerSideProps(ctx) {
    const jsonRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    const runs = await jsonRuns.json();

    return {
        props: {
            runs: runs
        }
    };
}

export default Home;
