'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
  const searchParams = useSearchParams()

  const groupid = searchParams.get('groupid')

  const [ws, setWs] = useState<WebSocket | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:3000/ws')

    webSocket.onopen = () => {
      console.log('Cliente conectado')
      setWs(webSocket)
    }
    webSocket.onmessage = (event) => {
      console.log('Mensaje recibido', event.data)
    }
    webSocket.onclose = () => {
      console.log('Cliente desconectado. Intentando reconectar en 5 segundos')
      setTimeout(() => {
        const webSocket = new WebSocket('ws://localhost:3000/ws')
        setWs(webSocket)
      }, 5000)
    }
    webSocket.onerror = (error) => {
      console.error('Error', error)
    }

    setWs(webSocket)
    return () => {
      webSocket.close()
    }
  }, [])
  return (
    <>
      <h1 className="">Home page</h1>

      <input type="text" ref={inputRef} />
      <button
        disabled={!ws}
        onClick={() =>
          ws && ws.send(inputRef.current ? JSON.stringify({ groupid, message: inputRef.current.value }) : '')
        }
      >
        Enviar mensaje
      </button>
    </>
  )
}
