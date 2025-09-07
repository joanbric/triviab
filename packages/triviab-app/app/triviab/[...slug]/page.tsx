'use client'

import { type CommandType, cmdType } from '@triviab/types'
import { use, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export default function TriviabPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const [id, role, userId] = use(params).slug
  const [connectedUsers, setConnectedUsers] = useState<number>(0)
  const [roomOpen, setRoomOpen] = useState<boolean>(false)

  const [command, setCommand] = useState<CommandType | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      query: { userid: userId, triviabId: id }
    })

    socket.on('connect', () => {
      console.log('Connected to Socket.io server')

      socket.emit('message', {
        cmd: cmdType.JOIN,
        userId,
        triviabId: id,
        message: null
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      setCommand({
        cmd: cmdType.LEAVE,
        userId,
        triviabId: id,
        message: null
      })
    })

    socket.on('message', (data: CommandType) => {
      console.log('Message from server:', data)

      if (data.cmd === cmdType.CLIENT_COUNT) {
        setConnectedUsers(Number(data.message))
      } else if (data.cmd === cmdType.OPEN_ROOM) {
        setRoomOpen(true)
      }
    })

    socket.on('connect_error', (err) => {
      console.error('Socket error:', err.message)
      setCommand({
        cmd: cmdType.LEAVE,
        userId,
        triviabId: id,
        message: `Error: ${err.message}`
      })
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [role, id, userId])

  useEffect(() => {
    setTimeout(() => {
      document.title = 'TriviaB | ' + role
    }, 1000)
  }, [role])

  async function handleCreateRoom() {
    const res = await fetch(`/api/triviab/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ triviabId: id })
    })
    if (!res.ok) throw new Error('Failed to create room')

    const data = await res.json()
    if (data.status !== 'ok') throw new Error('Failed to create room')

    socketRef.current?.emit('message', {
      cmd: cmdType.OPEN_ROOM,
      userId,
      triviabId: id,
      message: null
    })

    console.log('Success:', data.message)
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Triviab page</h1>
      <main>
        {role === 'host' && (
          <>
            <p>Connected users: {connectedUsers}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer"
              onClick={handleCreateRoom}
            >
              Create room
            </button>
          </>
        )}

        {role === 'player' && (
          <>
            {roomOpen ? (
              <div>
                <h1>Welcome to Triviab</h1>
                <p>Please wait for the host to start the TriviaB</p>
                <canvas ref={canvasRef} className="w-dvw h-dvh border-4 border-black absolute inset-0"></canvas>
              </div>
            ) : (
              <div>
                <h1>Room is closed or does not exist</h1>
                <p>Please try again later. It should be open for the host.</p>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => {
            console.log('se envio el mensaje')
            if (command) socketRef.current?.emit('message', {
              cmd: cmdType.MESSAGE,
              userId,
              triviabId: id,
              message: 'hola, este es un mensaje de prueba'
            })
          }}
        >
          Enviar mensaje
        </button>
      </main>
    </div>
  )
}
