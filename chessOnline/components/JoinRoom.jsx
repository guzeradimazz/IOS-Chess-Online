import { useContext, useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet } from 'react-native'
import gameContext from '../gameContext'
import gameService from '../services/gameService'
import socketService from '../services/socketService'

export const JoinRoom = ({ isConnected, navigation }) => {
    const [roomName, setRoomName] = useState('')
    const [isJoining, setIsJoining] = useState(false)

    const handleChangeRoomName = (e) => {
        const room = e.replace(/[^0-9]/g, '')
        setRoomName(room)
    }

    const { setInRoom } = useContext(gameContext)

    const joinRoom = async () => {
        const socket = socketService.socket
        if (!roomName || roomName.trim() === '' || !socket) return

        setIsJoining(true)

        const joined = await gameService
            .JoinGameRoom(socket, roomName)
            .catch((e) => {

                alert('You cant connect this room')
            })

        if (joined) {
            setInRoom(true)
            navigation.navigate('Board')
        }
        setIsJoining(false)
        
    }
    useEffect(()=>{
        setRoomName('')
        setIsJoining(false)
        setInRoom(false)
    },[])

    return (
        <View style={styles.wrapper}>
            <Text>Enter room id</Text>
            <TextInput
                keyboardType="numeric"
                placeholder='Room id'
                style={styles.input}
                value={roomName}
                onChangeText={(e) => handleChangeRoomName(e)}
            />
            <Button
                onPress={joinRoom}
                disabled={isJoining || !isConnected}
                title={isJoining ? 'Joining...' : 'Join'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    input: {
        width: 200,
        height: 30,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        margin: 10
    }
})
