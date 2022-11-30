import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to Battle Decks</h1>
            <Link to='population-guesser'>Start</Link>
        </div>
    )
}

export default Home