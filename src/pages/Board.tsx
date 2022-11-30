import { useEffect, useState } from "react"

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
    const [test, setTest] = useState<newCountry[]>([])
    const [start, setStart] = useState<number>(0)
    const [playerCountry, setPlayerCountry] = useState<newCountry>({name: '', flag: '', population: 0})
    const [botCountry, setBotCountry] = useState<newCountry>({name: '', flag: '', population: 0})
 
    
    const grabCountries = async () => {
        const countries = await fetch('https://api.sampleapis.com/countries/countries')
        const data = await countries.json()
        const extractedData = await data.map((country: Country) => {
            return {
                name: country.name,
                flag: country.media.flag,
                population: country.population
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
    }
    

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <div>
                    <h2>{playerCountry.name}</h2>
                    <img src={playerCountry.flag} alt="Countries Flag"/>
                    <h3>Population</h3>
                    <h4>{playerCountry.population}</h4>
                </div>
                <div>
                    <h2>{botCountry.name}</h2>
                    <img src={botCountry.flag} alt="Countries Flag"/>
                    <h3>Population</h3>
                    <h4>{botCountry.population}</h4>
                </div>
            </div>
            <h3 onClick={() => gameStart()}>Generate Game</h3>
        </div>
    )
}

export default Board
 