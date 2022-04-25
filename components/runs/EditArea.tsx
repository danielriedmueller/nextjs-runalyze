import React, {Component} from "react";
import style from '../../style/editarea.module.scss';

interface IProps {
    mode: number;
    onChangeConfirm: () => Promise<void>;
    onDelete: () => Promise<void>;
    setMode: (mode: number) => void;
}

interface IState {
}

export enum Mode {
    None,
    Edit,
    Insert
}

export default class EditArea extends Component<IProps, IState> {
    render() {
        return <div className={style.editarea}>
            {this.props.mode !== Mode.None
                ? <>
                    <button className={style.confirmButton} onClick={this.props.onChangeConfirm}/>
                    {this.props.mode === Mode.Edit
                        ? <button className={style.deleteButton} onClick={this.props.onDelete}/>
                        : <button className={style.cancelButton} onClick={() => this.props.setMode(Mode.None)}/>
                    }
                </>
                : <>
                    <button className={style.insertButton} onClick={() => this.props.setMode(Mode.Insert)}/>
                    <button className={style.editButton} onClick={() => this.props.setMode(Mode.Edit)}/>
                </>
            }
        </div>
    }
}
