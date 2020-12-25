import React, {Component} from "react";
import style from '../style/subheader.module.scss';
import {SingleRun} from "./SingleRun";
import {runToEditRun, runToJson, stringToDuration} from "../helper/functions";
import dayjs from "dayjs";
import {EditRun} from "./EditRun";

export default class Subheader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            insertMode: false,
            editRun: props.currentRun ? runToEditRun(props.currentRun): null,
            newRun: runToEditRun({
                date: dayjs(),
                distance: 0,
                duration: dayjs.duration({
                    seconds: 0,
                    minutes: 0,
                    hours: 0
                })
            })
        }

        this.activateEditMode = this.activateEditMode.bind(this);
        this.activateInsertMode = this.activateInsertMode.bind(this);
        this.onChangeConfirm = this.onChangeConfirm.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onChange(evt) {
        const runType = this.state.editMode ? 'editRun' : 'newRun';
        let editRun = this.state[runType];
        editRun[evt.target.name] = evt.target.value;
        this.setState({[runType]: editRun});
    }

    onChangeConfirm(evt) {
        const runType = this.state.editMode ? 'editRun' : 'newRun';
        let editRun = this.state[runType];
        this.props.onChange({
            date: editRun.date + ' ' + editRun.time,
            distance: editRun.distance,
            duration: editRun.duration,
            id: editRun.id
        });

        this.setState({editMode: false, insertMode: false});
    }

    onDelete(evt) {
        this.props.onDeleteRun(this.props.currentRun.id);
        this.setState({editMode: false, insertMode: false});
    }

    onCancel() {
        this.setState({editMode: false, insertMode: false});
    }

    activateEditMode() {
        this.setState({editMode: true, insertMode: false});
    }

    activateInsertMode() {
        this.setState({editMode: false, insertMode: true});
    }

    render() {
        return <div className= {this.state.editMode || this.state.insertMode
                ? [style.subheader, style['edit-mode']].join(" ")
                : style.subheader
            }>
            <div className={style.currentRun}>
                {this.state.editMode || this.state.insertMode ? <EditRun
                    editRun={this.state.insertMode ? this.state.newRun : this.state.editRun}
                    onChange={this.onChange}
                /> : <SingleRun
                    class={this.props.graphMode}
                    run={this.props.currentRun}
                    changeCurrentRun={this.props.changeCurrentRun}
                    activeClass={this.props.graphMode + 'Active'}
                    activateEditMode={this.activateEditMode}
                />}
            </div>
            <div className={style.buttonContainer}>
                {this.state.editMode || this.state.insertMode
                    ? <>
                        <button className={style.confirmButton} onClick={this.onChangeConfirm}/>
                        {this.state.editMode
                            ? <button className={style.deleteButton} onClick={this.onDelete} />
                            : <button className={style.cancelButton} onClick={this.onCancel} />
                        }
                    </>
                    : <button className={style.insertButton} onClick={this.activateInsertMode}/>
                }
            </div>
        </div>;
    }
}