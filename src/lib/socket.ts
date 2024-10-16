import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io()
  }
  return socket
}

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not initialized')
  }
  return socket
}