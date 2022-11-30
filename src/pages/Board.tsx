import { useState } from "react"
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
    const [playerPopulation, setPlayerPopulation] = useState<number>(0)
    const [botCountry, setBotCountry] = useState<newCountry>({name: '', flag: '', population: 0})
    const [botPopulation, setBotPopulation] = useState<number>(0)
    const [shuffledCountries, setShuffledCountries] = useState<newCountry[]>([])
    const [botIndex, setBotIndex] = useState<number>(1)
    const [playerLost, setPlayerLost] = useState<boolean>(false)
 
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
        setShuffledCountries(shuffled)
        return shuffled.slice(0, 2);
      }

    const gameStart = async () => {
        const allCountries = await grabCountries()
        const randomCountries = await getRandomCountries(allCountries)
        setPlayerCountry(randomCountries[0])
        setPlayerPopulation(randomCountries[0].population)
        setBotCountry(randomCountries[1])
        setBotPopulation(randomCountries[1].population)
        setGameStarted(true)
        setPlayerLost(false)
    }

    const gameStop = async () => {
        setGameStarted(false)
        setPlayerCountry({name: '', flag: '', population: 0})
        setPlayerPopulation(0)
        setBotCountry({name: '', flag: '', population: 0})
        setBotPopulation(0)
    }

    const botDefeated = async () => {
        setPlayerPopulation(playerCountry.population + botPopulation)
        setBotIndex(botIndex + 1)
        setBotCountry(shuffledCountries[botIndex])
        setBotPopulation(botCountry.population)
    }

    const playerDefeated = async () => {
        setPlayerLost(true)
        setGameStarted(false)
    }

    const botSelection = async () => {
        const choices = ['attack', 'defend']
        const randomChoice = choices.sort(() => 0.5 - Math.random())
        return randomChoice[0]
    }

    const playerSelection = async (selection: string) => {
        const botChoice = await botSelection()
        if (playerCountry.population * 0.10 > playerPopulation) {
            return playerDefeated()
        }
        if (botCountry.population * 0.10 > botPopulation) {
            return botDefeated()
        }
        if (botChoice == 'attack' && selection == 'attack') {
            const botDeduction = Number((Math.random() * (botPopulation * Math.random())).toFixed(0))
            const playerDeduction = Number((Math.random() * (playerPopulation * Math.random())).toFixed(0))
            setBotPopulation(botPopulation - botDeduction)
            setPlayerPopulation(playerPopulation - playerDeduction)
        } else if (botChoice == 'defend' && selection == 'defend') {
            const botAddition = Number((Math.random() * (botPopulation * 0.20)).toFixed(0))
            const playerAddition = Number((Math.random() * (playerPopulation * 0.10)).toFixed(0))
            setBotPopulation(botPopulation + botAddition)
            setPlayerPopulation(playerPopulation + playerAddition)
        } else if (botChoice == 'attack' && selection == 'defend') {
            const botDeduction = Number((Math.random() * (botPopulation * 0.10)).toFixed(0))
            const playerDeduction = Number((Math.random() * (playerPopulation * 0.20)).toFixed(0))
            setBotPopulation(botPopulation - botDeduction)
            setPlayerPopulation(playerPopulation - playerDeduction)
        } else {
            const botDeduction = Number((Math.random() * (botPopulation * 0.20)).toFixed(0))
            const playerDeduction = Number((Math.random() * (playerPopulation * 0.10)).toFixed(0))
            setBotPopulation(botPopulation - botDeduction)
            setPlayerPopulation(playerPopulation - playerDeduction)
        }
    }
    

    return (
        <div>
            <div className="title">
                <h1>Player Country</h1>
                <h1>Bot Country</h1>
            </div>
            <div className="board">
                {playerCountry.name != '' ? 
                    <div className="box">
                        <h2>{playerCountry.name}</h2>
                        <img className="flag" src={playerCountry.flag} alt="Countries Flag"/>
                        <h3>Population</h3>
                        <h4>{new Intl.NumberFormat().format(playerPopulation)}</h4>
                    </div>
                    :
                    <div className="box">
                        <h1>Placeholder</h1>
                    </div>
                
                }
                {botCountry.name != '' ? 
                    <div className="box">
                        <h2>{botCountry.name}</h2>
                        <img className="flag" src={botCountry.flag} alt="Countries Flag"/>
                        <h3>Population</h3>
                        <h4>{new Intl.NumberFormat().format(botPopulation)}</h4>
                    </div>
                    :
                    <div className="box">
                        <h1>Placeholder</h1>
                    </div>
                
                }
            </div>
            {playerLost 
                ? 
                <div>
                    <h1>You lost</h1>
                    <div>
                        <button onClick={() => gameStart()}>Restart</button>
                        <button onClick={() => gameStop()}>Reset</button>
                    </div>
                </div>
                :
                <></>
            }
            {gameStarted 
                ? 
                <div>
                    <div>
                        <button onClick={() => playerSelection('attack')}>Attack</button>
                        <button onClick={() => playerSelection('defend')}>Defend</button>
                    </div>
                    <button onClick={() => gameStop()}>Stop</button>
                </div>
                : 
                <></>
        
            }
            {!gameStarted 
                ? 
                <h3 onClick={() => gameStart()}>Generate Game</h3>
                :
                <></>
            }
        </div>
    )
}

export default Board
 