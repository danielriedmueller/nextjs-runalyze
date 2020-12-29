import {calcPace, stringToDuration} from "../../helper/functions";
import React, { PureComponent } from 'react';
import {Legend, Area, Tooltip, AreaChart, ResponsiveContainer } from 'recharts';

class StackedAreaChart extends PureComponent {
    constructor(props) {
        super(props);
        this.opacityLow = 0.4;
        this.state = {
            minMax: {
                pace: {
                    min: 240,
                    max: 480,
                },
                duration: {
                    min: 900,
                    max: 5400,
                },
                distance: {
                    min: 3,
                    max: 15,
                }
            }
        };
    }

    normalize(val, minMax) {
        return (val - minMax.min) / (minMax.max - minMax.min);
    }

    handleTouchMove(evt) {
        const {svgWidth, runs, changeCurrentRun} = this.props
        const svg = this.ref.current;

        const pt = svg.createSVGPoint();
        pt.x = evt.clientX || evt.targetTouches[0].clientX;

        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        const xOrg = Math.floor(svgP.x / svgWidth * this.count);

        const currentRun = runs[xOrg];
        if (currentRun) {
            changeCurrentRun(currentRun);
        }
    }

    getData() {
        return this.props.runs.map(run => ({
            id: run.id,
            pace: this.normalize(stringToDuration(calcPace(run.distance, run.duration)).asSeconds(), this.state.minMax.pace),
            distance: this.normalize(run.distance, this.state.minMax.distance),
            duration: this.normalize(run.duration.asSeconds(), this.state.minMax.duration)
        }));
    }

    renderTooltip(evt) {
        if (evt.payload[0]) {
            this.props.changeCurrentRun(this.props.runs.find(run => run.id === evt.payload[0].payload.id));
        }
    }

    render() {
        const data = this.getData();

        return (
            <div style={{width: '100%', height: 400}}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Legend verticalAlign="top" height={36}/>
                        <Tooltip content={this.renderTooltip.bind(this)} />
                        <Area type="monotone" dataKey="pace" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="distance" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        <Area type="monotone" dataKey="duration" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

StackedAreaChart.defaultProps = {
    data: [],
    color: '#ff4500',
    svgHeight: 400,
    svgWidth: 600,
}

export default StackedAreaChart;