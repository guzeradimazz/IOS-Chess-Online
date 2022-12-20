class GameService {
    async JoinGameRoom(socket, roomId) {
        return new Promise((res, rej) => {
            socket.emit('join_game', { roomId })
            socket.on('room_joined', () => res(true))
            socket.on('room_join_error', ({ err }) => rej(err))
        })
    }

    async updateGame(socket, board) {
        socket.emit('update_game', JSON.stringify(board))
    }

    async onGameUpdate(socket, listener) {
        socket.on('on_game_update', (board) => listener(board))
    }

    async onStartGame(socket, listener) {
        socket.on('start_game', listener)
    }

    async gameLeave(socket, message) {
        socket.emit('game_leave', { message })
    }

    async onGameLeave(socket, listener) {
        socket.on('on_game_leave', ({ message }) => listener(message))
    }
}

export default new GameService()
