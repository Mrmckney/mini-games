import { useEffect, useState } from "react"
import '../css/board.css'

interface newCountry {
    name: string,
    flag: string
    population: number,
}

interface Country {
    name: string
    media: {
        flag: string
    }
    population: number
}


const Board = () => {

    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [playerCountry, setPlayerCountry] = useState<newCountry>({name: '', flag: '', population: 0})
    const [botCountry, setBotCountry] = useState<newCountry>({name: '', flag: '', population: 0})
 
    console.log(playerCountry)
    const grabCountries = async () => {
        const countries = await fetch('https://api.sampleapis.com/countries/countries')
        const data = await countries.json()
        const extractedData = await data.map((country: Country) => {
            return {
                name: country.name,
                flag: country.media.flag,
                population: country.population ?? (Math.random() * 2000000).toFixed(0)
            }
        })
        return extractedData
    }

    const getRandomCountries = async (array: Array<newCountry>) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
      
        return shuffled.slice(0, 2);
      }

    const gameStart = async () => {
        const allCountries = await grabCountries()
        const randomCountries = await getRandomCountries(allCountries)
        setPlayerCountry(randomCountries[0])
        setBotCountry(randomCountries[1])
        setGameStarted(true)
    }
    

    return (
        <div>
            <div className="board">
                <div>
                    <h2>{playerCountry.name}</h2>
                    <img className="flag" src={playerCountry.flag} alt="Countries Flag"/>
                    <h3>Population</h3>
                    <h4>{new Intl.NumberFormat().format(playerCountry.population)}</h4>
                </div>
                <div>
                    <h2>{botCountry.name}</h2>
                    <img className="flag" src={botCountry.flag} alt="Countries Flag"/>
                    <h3>Population</h3>
                    <h4>{new Intl.NumberFormat().format(botCountry.population)}</h4>
                </div>
            </div>
            {gameStarted ? 
            <div>
                <button>Attack</button>
                <button>Stop</button>
                <button>Defend</button>
            </div>
            : 
            <></>
        
        }
            <h3 onClick={() => gameStart()}>Generate Game</h3>
        </div>
    )
}

export default Board
 