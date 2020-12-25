import {Component} from "react";
import style from '../style/header.module.scss';
import Head from 'next/head';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <><Head>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#e63946" />
                <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />
                <title>Next.js PWA Example</title>
                <link rel='manifest' href='/manifest.json' />
            </Head>
            <header className={style.header}><h1>Runalyze</h1></header>
        </>
    }
}