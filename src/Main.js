import React, { useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import yay from "./yay.mp3"

export default function Main(){
    const [dice, setDice] = React.useState(allNewDice())
    
    const [tenzies, setTenzies] = React.useState(false)

    const [rollCount, setRollCount] = React.useState(0)

    const [bestCount, setBestCount] = React.useState(-1)

    const remark = "Wow! You finished the game!"

    function play(){
        new Audio(yay).play()
    }

    useEffect(() =>{
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setBestCount(prevBest => Math.min(prevBest !== -1 ? prevBest : rollCount, rollCount))
            play()
        }
    }, [dice])

    function generateNewDie(){
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function holdDice(id){
       setDice(olddice => olddice.map(die => {
            return die.id === id ? 
                {...die, die, isHeld: !die.isHeld} :
                die
        }
       ))
    }

    function newGame(){
        setRollCount(0)
        setDice(allNewDice())
    }
    function rollDice() {
        if(tenzies){
            setRollCount(0)
            setTenzies(false)
            setDice(allNewDice())
        }
        else{
            setRollCount(oldcnt => oldcnt + 1)
            setDice(oldDice => oldDice.map(dice =>{
                return dice.isHeld ? 
                dice :
                generateNewDie() 
            }))
        }
    }

    const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} id={die.id} holdDice={() => holdDice(die.id)}/>)
        return(
            <div className="main-box">
            {tenzies && <Confetti numberOfPieces={1000} recycle={false} />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <span className="score">
                <p>Roll Count: {rollCount}</p>
                <p>Least Count: {bestCount > -1 ? bestCount : "NA"}</p>
            </span>
            <div className="grid-container">
                {diceElements}
            </div>
            <span className="btn">
                <button className="roll-btn" onClick={rollDice}>{!tenzies ? "Roll" : "New Game"}</button>
                {!tenzies && <button className="roll-btn" onClick={newGame}>New Game</button>}
            </span>
            {tenzies && <p>{remark} With {bestCount === rollCount ? "best" : ""} score: {rollCount} {bestCount === rollCount ? "🏆" : "🎉"}</p>}
        </div>
    );
}