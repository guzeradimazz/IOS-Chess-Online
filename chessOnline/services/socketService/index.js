import { io } from 'socket.io-client'

class SocketService {
    socket = null
    connect(url) {
        return new Promise((rs, rj) => {
            this.socket = io(url)

            if (!this.socket) return rj()
            this.socket.on('connect', () => {
                rs(this.socket)
            })

            this.socket.on('connect_error', (err) => {
                console.log('Connection error ', err)
                rj(err)
            })
            
        })
    }
}

export default new SocketService()
