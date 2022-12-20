import  React  from 'react'
import { Chess } from 'chess.js'

export interface IGameContextProps {
    isInRoom: boolean
    setInRoom: (isInRoom: boolean) => void
    playerColor:'w'|'b'
    setPlayerColor:(color:'w'|'b')=>void
    isPlayerTurn:boolean
    setPlayerTurn:(turn:boolean)=>void
    isGameStarted:boolean
    setGameStarted:(started:boolean)=>void
    // board:Chess
    // setBoard:(board:Chess)=>void
}

const defaultState: IGameContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    playerColor: 'w',
    setPlayerColor:()=>{},
    isPlayerTurn:false,
    setPlayerTurn:()=>{},
    isGameStarted:false,
    setGameStarted:()=>{},
    // board:new Chess(),
    // setBoard:()=>{}
}

export default React.createContext(defaultState)
