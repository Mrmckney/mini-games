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
    const [botCountry, setBotCountry] = useState<newCountry>({name: '', flag: '', population: 0})
    const [shuffledCountries, setShuffledCountries] = useState<newCountry[]>([])
    const [botIndex, setBotIndex] = useState<number>(2)
    const [choseRight, setChoseRight] = useState<boolean>(false)
    const [playerLost, setPlayerLost] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
 
    const grabCountries = async () => {
        const countries = await fetch('https://api.sampleapis.com/countries/countries')
        const data = await countries.json()
        const extractedData = await data.map((country: Country) => {
            return {
                name: country.name,
                flag: country.media.flag ?? 'https://usflags.design/assets/images/glossary-field.svg',
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
        setBotCountry(randomCountries[1])
        setGameStarted(true)
        setPlayerLost(false)
        setBotIndex(2)
        setScore(0)
        setChoseRight(false)
    }

    const gameStop = async () => {
        setGameStarted(false)
        setPlayerLost(false)
        setPlayerCountry({name: '', flag: '', population: 0})
        setBotCountry({name: '', flag: '', population: 0})
        setChoseRight(false)
    }

    const check = async (guess: string) => {
        if (guess == 'higher' && playerCountry.population < botCountry.population) {
            setChoseRight(true)
            return
        } 
        if (guess == 'lower' && playerCountry.population > botCountry.population) {
            setChoseRight(true)
            return
        }
        if (guess == 'lower' && playerCountry.population < botCountry.population || guess == 'higher' && playerCountry.population > botCountry.population) {
            setPlayerLost(true)
        }
    }

    const nextCountry = async () => {
        setScore(score + 1)
        setChoseRight(false)
        setPlayerCountry(botCountry)
        setBotCountry(shuffledCountries[botIndex])
        setBotIndex(botIndex + 1)
    }
    

    return (
        <div>
            <div className="title">
                <h1>Guess Population</h1>
                <h2>Your Score: {score}</h2>
            </div>
            <div>
                {gameStarted 
                    ? 
                    <h3>Is {botCountry.name} higher or lower than {playerCountry.name}</h3>
                    :
                    <></>
                }
            </div>
            <div className="board">
                {playerCountry.name != '' ? 
                    <div className="box">
                        <h2>{playerCountry.name}</h2>
                        <img className="flag" src={playerCountry.flag} alt="Countries Flag"/>
                        <h3>Population</h3>
                        <h4>{new Intl.NumberFormat().format(playerCountry.population)}</h4>
                    </div>
                    :
                    <div className="box">
                        <h1>Placeholder</h1>
                    </div>
                
                }
                {gameStarted 
                    ? 
                    <div>
                        <div>
                            <button className="button-62" onClick={() => check('higher')}>Higher</button>
                        </div>
                        <div style={{marginTop: '50px'}}>
                            <button className="button-62" onClick={() => check('lower')}>Lower</button>
                        </div>
                    </div>
                
                    :
                    <></>
                }
                {botCountry.name != '' ? 
                    <div className="box">
                        <h2>{botCountry.name}</h2>
                        <img className="flag" src={botCountry.flag} alt="Countries Flag"/>
                        <h3>Population</h3>
                        {choseRight || playerLost
                            ?
                            <h4>{new Intl.NumberFormat().format(botCountry.population)}</h4>    
                            :
                            <h4>=========</h4>
                        }
                    </div>
                    :
                    <div className="box">
                        <h1>Placeholder</h1>
                    </div>
                }
            </div>
            {choseRight 
                ?
                <div>
                    <h1>You got it</h1>
                    <div className="button-spacing">
                        <button className="button-62" onClick={() => gameStop()}>Stop</button>
                        <button className="button-62" onClick={() => nextCountry()}>Next Country</button>
                    </div>
                </div>
                :
                <></>
            }
            {playerLost 
                ? 
                <div>
                    <h1>You lost</h1>
                    <div className="button-spacing">
                        <button className="button-62" onClick={() => gameStart()}>Restart</button>
                        <button className="button-62" onClick={() => gameStop()}>Reset</button>
                    </div>
                </div>
                :
                <></>
            }
            {gameStarted 
                ? 
                <div style={{marginBottom: '100px'}}>
                    <button className="button-62" onClick={() => gameStop()}>Stop Game</button>
                </div>
                : 
                <></>
        
            }
            {!gameStarted && !playerLost
                ? 
                <button className="button-62" onClick={() => gameStart()}>Generate Game</button>
                :
                <></>
            }
        </div>
    )
}

export default Board
 