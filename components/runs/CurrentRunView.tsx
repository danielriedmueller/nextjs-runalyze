import React, {Component} from "react";
import style from '../../style/currentrun.module.scss';
import {deleteRun, insertRun, updateRun} from "../../helper/fetch";
import EditRunView from "./EditRunView";
import IRun from "../../interfaces/IRun";
import IEditRun from "../../interfaces/IEditRun";
import NewRunView from "./NewRunView";
import SingleRunView from "./SingleRunView";
import IUser from "../../interfaces/IUser";
import EditRun from "../../model/EditRun";

interface IProps {
    run: IRun;
    user: IUser;
    statistics: string;
    setStatistics: (statistics: string) => void;
    upsert: (run: IEditRun) => void;
}

interface IState {
    editMode: boolean;
    insertMode: boolean;
    editRun: IEditRun;
}

export default class CurrentRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            insertMode: false,
            editRun: null
        }
    }

    upsert = (editRun: IEditRun): void => {
        this.setState({editRun})
    }

    onChangeConfirm = async (): Promise<void> => {
        if (!this.state.editRun) {
            return;
        }

        if (this.state.editRun.isValid()) {
            this.props.upsert(this.state.editRun);
            this.exitEditMode();
        }
    }

    onDelete = async (): Promise<void> => {
        this.exitEditMode();

        await deleteRun(this.props.run);
    }

    exitEditMode = () => {
        this.setState({editMode: false, insertMode: false});
    }

    activateEditMode = () => {
        this.setState({
            editRun: EditRun.fromRun(this.props.run),
            editMode: true,
            insertMode: false
        });
    }

    activateInsertMode = () => {
        this.setState({
            editRun: EditRun.create(),
            editMode: false,
            insertMode: true
        });
    }

    render() {
        return <div className={this.state.editMode || this.state.insertMode
            ? [style.currentRun, style['editMode']].join(" ")
            : style.currentRun
        }>
            <div className={style.currentRun}>
                {this.state.editMode ? <EditRunView
                    run={this.state.editRun}
                    update={this.upsert}
                /> : this.state.insertMode ? <NewRunView
                    run={this.state.editRun}
                    insert={this.upsert}
                /> : <SingleRunView
                    run={this.props.run}
                    statistics={this.props.statistics}
                    setStatistics={this.props.setStatistics}
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
                    : <>
                        <button className={style.insertButton} onClick={this.activateInsertMode}/>
                        <button className={style.editButton} onClick={this.activateEditMode}/>
                    </>
                }
            </div>
        </div>;
    }
}
