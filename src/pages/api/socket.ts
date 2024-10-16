import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket as SocketIOSocket } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface SocketServer extends NetServer {
  io?: SocketIOServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: any
}

const initSocket = (res: NextApiResponseWithSocket): SocketIOServer => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...')
    const io = new SocketIOServer(res.socket.server as any, {
      path: '/api/socket',
      addTrailingSlash: false,
    })

    io.on('connection', (socket: SocketIOSocket) => {
      console.log('New WebSocket connection', socket.id)

      socket.on('joinChallenge', (data: { challengeId: string; userId: string }) => {
        const { challengeId, userId } = data
        socket.join(challengeId)
        io.to(challengeId).emit('userJoined', { userId })
      })

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected', socket.id)
      })
    })

    res.socket.server.io = io
  } else {
    console.log('Socket.IO server already initialized')
  }
  return res.socket.server.io
}

const handler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (req.method === 'POST') {
    // Handle POST request if needed
    res.status(200).json({ message: 'POST request received' })
  } else if (req.method === 'GET') {
    const io = initSocket(res)
    res.status(200).json({ message: 'Socket.IO server initialized', clients: io.engine.clientsCount })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler