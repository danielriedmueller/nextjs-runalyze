import React, {Component} from "react";

interface IProps {

}

interface IState {

}

class Home extends Component<IProps, IState> {
    fetchTest = async () => {
        const runsResponse = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    }

    render() {
        return <div id="app"><button onClick={this.fetchTest}>TEST</button></div>
    }
}

export default Home;
