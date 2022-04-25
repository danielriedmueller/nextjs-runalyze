import {Component} from "react";
import style from '../style/header.module.scss';
import Head from 'next/head';

interface IProps {
}

interface IState {
}

export default class Header extends Component<IProps, IState> {
    render() {
        return <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="theme-color" content="#e63946"/>
                <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
                <title>Runalyze</title>
                <link href='/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16'/>
                <link href='/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32'/>
                <link rel='manifest' href='/manifest.json'/>
            </Head>
            <header className={style.header}>
                <h1>Runalyze</h1>
            </header>
        </>
    }
}
