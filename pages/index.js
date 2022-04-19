import LineChart from "../components/graphs/LineChart";
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
import BestRuns from "../components/runs/BestRuns";
import WeekRuns from "../components/runs/WeekRuns";
import MonthRuns from "../components/runs/MonthRuns";
import YearRuns from "../components/runs/YearRuns";
import GoogleLogin from 'react-google-login';

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.locale('de');

class Home extends Component {
    constructor(props) {
        super(props);

        if (props.runs && props.yearRuns && props.monthRuns) {
            const runs = jsonToRuns(props.runs);
            const yearRuns = jsonToRuns(props.yearRuns);
            const monthRuns = jsonToRuns(props.monthRuns);
            const currentRun = runs[0];

            this.state = {
                runs,
                yearRuns,
                monthRuns,
                filteredRuns: monthRuns,
                newRun: {
                    distance: null,
                    duration: null
                },
                currentRun,
                graphMode: 'vdot',
                filter: {
                    year: yearRuns[0].date.format('YYYY'),
                    month: monthRuns[0].date.format('M'),
                    week: null
                },
                user: {
                    token: null,
                    id: null,
                    name: null
                }
            };
        } else {
            this.state = {
                filteredRuns: [],
                newRun: {
                    distance: null,
                    duration: null
                },
                graphMode: 'vdot',
                filter: {
                    year: null,
                    month: null,
                    week: null
                },
                user: {
                    token: null,
                    id: null,
                    name: null
                }
            };
        }


        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.changeCurrentRun = this.changeCurrentRun.bind(this);
        this.changeYearFilter = this.changeYearFilter.bind(this);
        this.changeMonthFilter = this.changeMonthFilter.bind(this);
        this.changeWeekFilter = this.changeWeekFilter.bind(this);
        this.changeGraphMode = this.changeGraphMode.bind(this);
        this.fetchFitData = this.fetchFitData.bind(this);
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
            const jsonYearRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    start: filterYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
                    end: filterYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
                }),
            });
            const yearRuns = await jsonYearRuns.json();

            const runs = jsonToRuns(yearRuns);
            this.setState({
                yearRuns: runs,
                monthRuns: null,
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
                yearRuns: this.state.yearRuns,
                monthRuns: null,
                filteredRuns: this.state.yearRuns,
                filter: {
                    month: null,
                    week: null,
                    year: this.state.filter.year
                }
            });
        } else {
            const filterMonth = dayjs(month + '-01-' + this.state.filter.year);
            const jsonMonthRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    start: filterMonth.startOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
                    end: filterMonth.endOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
                }),
            });
            const monthRuns = await jsonMonthRuns.json();

            const runs = jsonToRuns(monthRuns);

            this.setState({
                yearRuns: this.state.yearRuns,
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

    async changeWeekFilter(runs, week) {
        const filterState = this.state.filter
        if (this.state.filter.week === week) {
            filterState.week = null
            this.setState({
                filteredRuns: this.state.monthRuns,
                filter: filterState
            });
        } else {
            filterState.week = week;
            this.setState({
                filteredRuns: runs,
                filter: filterState
            });
        }
    }

    async fetchFitData() {
        await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: this.state.user.token,
                user: this.state.user.id
            }),
        });
    }

    responseGoogle = (response) => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName
        }
        this.setState({user});
    }

    responseGoogleFailed = (response) => {
        console.log('google login failed');
        this.setState({
            user: {
                token: null,
                id: null,
                name: null
            }
        })
    }

    render() {
        return <div id="app">
            <Header
                runCount={this.state.filteredRuns.length}
            />
            {this.state.user.token ?
                <button onClick={this.fetchFitData}>Fit Data</button> :
                <GoogleLogin
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogleFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
                />
            }
            {this.state.user.name ? <div>
                Hallo {this.state.user.name}!
            </div> : null}
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
                    runs={this.state.filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                <LineChart
                    runs={this.state.filteredRuns}
                    changeCurrentRun={this.changeCurrentRun}
                    changeGraphMode={this.changeGraphMode}
                    currentRun={this.state.currentRun}
                    graphMode={this.state.graphMode}
                />
                {this.state.monthRuns ? <WeekRuns
                    runs={this.state.monthRuns}
                    changeFilter={this.changeWeekFilter}
                    runFilter={this.state.filter}
                /> : null}
                {this.state.yearRuns ? <MonthRuns
                    runs={this.state.yearRuns}
                    changeFilter={this.changeMonthFilter}
                    runFilter={this.state.filter}
                /> : null}
                {this.state.runs ? <YearRuns
                    runs={this.state.runs}
                    changeFilter={this.changeYearFilter}
                    runFilter={this.state.filter}
                /> : null}
            </div>
        </div>
    }
}

export async function getServerSideProps(ctx) {
    /*
    const jsonRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    const runs = await jsonRuns.json();

    const lastRun = runs[0].date;
    const filterYear = dayjs(lastRun);
    const jsonYearRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            start: filterYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            end: filterYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const yearRuns = await jsonYearRuns.json();

    const lastYearRun = yearRuns[0].date;
    const filterMonth = dayjs(lastYearRun);
    const jsonMonthRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            start: filterMonth.startOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            end: filterMonth.endOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const monthRuns = await jsonMonthRuns.json();

    return {
        props: {
            runs: runs,
            yearRuns: yearRuns,
            monthRuns: monthRuns
        }
    };

     */

    return {
        props: {
            runs: null,
            yearRuns: null,
            monthRuns: null
        }
    };
}

export default Home;
