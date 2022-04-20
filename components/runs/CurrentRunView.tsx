import React, {Component} from "react";
import style from '../../style/subheader.module.scss';
import {deleteRun, upsertRun} from "../../helper/fetch";
import EditRunView from "./EditRunView";
import IRun from "../../interfaces/IRun";
import IEditRun from "../../interfaces/IEditRun";
import NewRunView from "./NewRunView";
import SingleRunView from "./SingleRunView";

interface IProps {
    run: IRun,
    statistics: string,
    setStatistics: (statistics: string) => void
}

interface IState {
    editMode: boolean,
    insertMode: boolean,
    editRun: IEditRun,
    currentRun: IRun,
    statistics: string,
    setStatistics: (statistics: string) => void
}

export default class CurrentRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            insertMode: false,
            editRun: null,
            currentRun: props.run,
            statistics: props.statistics,
            setStatistics: props.setStatistics
        }
    }

    upsert = (editRun: IEditRun): void => {
        this.setState({editRun})
    }

    onChangeConfirm = async (): Promise<void> => {
        this.exitEditMode();

        await upsertRun(this.state.editRun);
    }

    onDelete = async (): Promise<void> => {
        this.exitEditMode();

        await deleteRun(this.state.currentRun);
    }

    exitEditMode = () => {
        this.setState({editMode: false, insertMode: false});
    }

    activateEditMode = () => {
        this.setState({editMode: true, insertMode: false});
    }

    activateInsertMode = () => {
        this.setState({editMode: false, insertMode: true});
    }

    render() {
        return <div className={this.state.editMode || this.state.insertMode
            ? [style.subheader, style['edit-mode']].join(" ")
            : style.subheader
        }>
            <div className={style.currentRun}>
                {this.state.editMode ? <EditRunView
                    run={this.state.currentRun}
                    upsert={this.upsert}
                /> : this.state.insertMode ? <NewRunView
                    upsert={this.upsert}
                /> : <SingleRunView
                    run={this.state.currentRun}
                    statistics={this.state.statistics}
                    setStatistics={this.state.setStatistics}
                    activateEditMode={this.activateEditMode}
                />}
            </div>
            <div className={style.buttonContainer}>
                {this.state.editMode || this.state.insertMode
                    ? <>
                        <button className={style.confirmButton} onClick={this.onChangeConfirm}/>
                        {this.state.editMode
                            ? <button className={style.deleteButton} onClick={this.onDelete}/>
                            : <button className={style.cancelButton} onClick={this.exitEditMode}/>
                        }
                    </>
                    : <button className={style.insertButton} onClick={this.activateInsertMode}/>
                }
            </div>
        </div>;
    }
}
