import React, { useEffect, useState } from 'react'
import { initSocket, getSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = initSocket()
    setSocket(newSocket)

    newSocket.on('message', (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && socket) {
      socket.emit('message', inputMessage)
      setInputMessage('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <div className="bg-gray-100 p-4 h-64 overflow-y-auto mb-4 rounded-md">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow border p-2 mr-2 rounded-md"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  )
}