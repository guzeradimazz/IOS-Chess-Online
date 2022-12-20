import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { Chess } from 'chess.js'
import Background from './Background'
import Piece from './Piece'
import { SIZE } from './Notation'
import gameContext from '../gameContext'
import socketService from '../services/socketService'
import gameService from '../services/gameService'
import { CheckWinner } from './CheckWinner'

const PlayerStopper = () => {
    return (
        <View
            style={{
                position: 'absolute',
                zIndex: 99,
                width: '100%',
                height: '100%',
                bottom: 0,
                left: 0
            }}
        ></View>
    )
}

const PlayerWaiting = ({isConnected}) => {
    return (
        <View
            style={{
                flex: 1,
                position: 'absolute',
                top: 200,
                left: 50,
                width: 290,
                height: 200,
                backgroundColor: '#fff',
                zIndex: 99,
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <Text style={{ textAlign: 'center' }}>
                {isConnected ? 'Waiting to connect other player...' : 'Press go back connection lost '}
            </Text>
        </View>
    )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        width,
        height: width + 125
    }
})

interface BoardProps {
    connectSocket: () => void
    navigation: Object
    isConnected:boolean
}

interface IOptionsGame {
    color: 'w' | 'b'
    start: boolean
}

const Board = ({ connectSocket, navigation,isConnected }: BoardProps) => {
    const {
        playerColor,
        setPlayerColor,
        isPlayerTurn,
        setPlayerTurn,
        isGameStarted,
        setGameStarted
    } = useContext(gameContext)

    const chess = useConst(() => new Chess())

    const [state, setState] = useState({
        board: chess.board()
    })

    function useConst(initialValue: () => any) {
        const ref = useRef()
        if (ref.current === undefined) {
            //@ts-ignore
            ref.current = {
                value:
                    typeof initialValue === 'function'
                        ? initialValue()
                        : initialValue
            }
        }
        //@ts-ignore
        return ref.current.value
    }

    const updateGameBoard = (boardFen: string) => {
        if (socketService.socket) {
            gameService.updateGame(socketService.socket, boardFen)
            setPlayerTurn(false)
        }
    }

    const handleGameUpdate = () => {
        if (socketService.socket)
            gameService.onGameUpdate(socketService.socket, (newFen: string) => {
                setPlayerTurn(true)

                chess.load(newFen)
                setState({
                    board: chess.board()
                })
            })
    }

    const handleGameStarted = () => {
        if (socketService.socket) {
            gameService.onStartGame(
                socketService.socket,
                (options: IOptionsGame) => {
                    setGameStarted(true)
                    setPlayerColor(options.color)
                    if (options.start) setPlayerTurn(true)
                    else setPlayerTurn(false)
                }
            )
        }
    }

    const handleGameLeaveCheck = () => {
        if (socketService.socket) {
            gameService.onGameLeave(socketService.socket, (message: string) => {
                alert(message)
                setGameStarted(false)
            })
        }
    }

    useEffect(() => {
        handleGameUpdate()
        handleGameStarted()
        handleGameLeaveCheck()
    }, [])

    const onTurn = useCallback(() => {
        setState({
            board: chess.board()
        })
        const boardFen = chess.fen()
        updateGameBoard(boardFen)
    }, [chess, playerColor])

    const handleGameLeave = () => {
        if (socketService.socket && isGameStarted) {
            gameService.gameLeave(
                socketService.socket,
                'Other person leave room, this room we cant use any more'
            )
        }
    }

    return (
        <View style={styles.container}>
            {(!isGameStarted || !isConnected) && <PlayerWaiting isConnected={isConnected}/>}
            {(!isGameStarted || !isPlayerTurn) && <PlayerStopper />}
            
            <Background />
            {state.board.map((row: any[], i: number) =>
                row.map(
                    (piece: { color: any; type: any } | null, j: number) => {
                        if (piece !== null) {
                            return (
                                <Piece
                                    chess={chess}
                                    key={`${i + j}`}
                                    position={{ x: j * SIZE, y: i * SIZE }}
                                    //@ts-ignore
                                    id={`${piece.color}${piece.type}` as const}
                                    onTurn={onTurn}
                                    enabled={playerColor === piece.color}
                                />
                            )
                        }
                        return null
                    }
                )
            )}
            <CheckWinner
                setGameStarted={handleGameLeave}
                navigation={navigation}
                chess={chess}
                isGameOver={chess.isGameOver()}
                connectSocket={connectSocket}
            />
        </View>
    )
}

export default Board
