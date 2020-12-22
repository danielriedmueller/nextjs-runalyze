import React, {Component} from "react";
import style from '../style/subheader.module.scss';
import SingleRun from "./SingleRun";
import NewRun from "./NewRun";

export default class Subheader extends Component {
    render() {
        return <div className={style.subheader}>
            <div className={style.currentRun}>
                <SingleRun
                    class={this.props.graphMode}
                    run={this.props.currentRun}
                    changeCurrentRun={this.props.changeCurrentRun}
                    activeClass={this.props.graphMode + 'Active'}
                />
            </div>
            <NewRun
                newRun={this.props.newRun}
                onChange={this.props.onChange}
                onInsert={this.props.onInsert}
            />
        </div>;
    }
}