import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import Board from './components/Board'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CreateAcc } from './components/CreateAcc'
import socketService from './services/socketService'
import GameContext from './gameContext'


import InternetConnectionAlert from "react-native-internet-connection-alert";

const Stack = createNativeStackNavigator()

const MainApp = ({ connectSocket, navigation,isConnected }) => {
    return (
        <SafeAreaView>
            <Board connectSocket={connectSocket} navigation={navigation} isConnected={isConnected}/>
        </SafeAreaView>
    )
}

const App = () => {
    const [isInRoom, setInRoom] = useState(false)
    const [playerColor, setPlayerColor] = useState('w')
    const [isPlayerTurn, setPlayerTurn] = useState(false)
    const [isGameStarted, setGameStarted] = useState(false)

    const connectSocket = async () => {
        const socket = await socketService
            .connect('http://localhost:9000')
            .catch((err) => {
                console.log('error ', err)
            })
    }

    const [isConnected, setConnected] = useState(false)
    useEffect(() => {
        connectSocket()
    }, [])

    const gameContextValue = {
        isInRoom,
        setInRoom,
        playerColor,
        setPlayerColor,
        isPlayerTurn,
        setPlayerTurn,
        isGameStarted,
        setGameStarted
    }

    return (
        <InternetConnectionAlert
            onChange={(connectionState) => {
                setConnected(connectionState.isConnected)
            }}
        >
            <GameContext.Provider value={gameContextValue}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                    >
                        <Stack.Screen name='CreateAcc'>
                            {(props) => <CreateAcc {...props} isConnected={isConnected}/>}
                        </Stack.Screen>
                        <Stack.Screen name='Board'>
                            {(props) => (
                                <MainApp
                                    {...props}
                                    isConnected={isConnected}
                                    connectSocket={connectSocket}
                                />
                            )}
                        </Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            </GameContext.Provider>
        </InternetConnectionAlert>
    )
}

export default App
