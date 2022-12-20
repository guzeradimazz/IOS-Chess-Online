import React, { useContext } from 'react'
import { Text, View,Button } from 'react-native'
import gameContext from '../gameContext'
import { Chess } from 'chess.js'

interface CheckWinnerProps {
    isGameOver: boolean
    chess:Chess
    navigation:any
    connectSocket:()=>void
    setGameStarted:()=>void
}

const styles = { zIndex:100}
export const CheckWinner = ({ isGameOver,chess,navigation,connectSocket,setGameStarted }: CheckWinnerProps) => {
    const { playerColor } = useContext(gameContext)
    const looser = playerColor === 'w' ? 'White' : 'Black'

    const reConnect =()=>{
        setGameStarted()
        connectSocket()
        navigation.popToTop()
    }
    if (isGameOver) {
        return (
            <View style={styles}>
                <Text style={{fontSize:20,fontWeight:'bold',margin:10}}>{chess.turn() ==='w'?'White':'Black'} lose the game</Text>
                <Text style={{fontSize:20,fontWeight:'bold',margin:10}}>{looser} side</Text>
                <Button  title='Go back' onPress={reConnect}/>
            </View>
        )
    } else
        return (
            <View style={styles}>
                <Text style={{fontSize:20,fontWeight:'bold',margin:10}}>Now is {chess.turn() ==='w'?'white':'black'}</Text>
                <Text style={{fontSize:20,fontWeight:'bold',margin:10}}>{looser} side</Text>
                <Button  title='Go back' onPress={reConnect}/>
            </View>
        )
}
