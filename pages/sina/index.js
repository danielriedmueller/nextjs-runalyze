import Home from "../index";

class DanHome extends Home {
    constructor(props) {
        super(props);
    }
}

export async function getServerSideProps(ctx) {
    const userId = 2;
    const jsonRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: userId}),
    });
    const runs = await jsonRuns.json();

    return {
        props: {
            runs: runs,
            user: userId
        }
    };
}

export default Home;
