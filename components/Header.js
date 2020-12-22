import {Component} from "react";
import style from '../style/header.module.scss';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <header className={style.header}>
            <h1>Runalyze</h1>
        </header>
    }
}