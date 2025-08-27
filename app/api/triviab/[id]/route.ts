import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'
import type { Triviab } from '@/types.ts'

async function saveUserAnswer(
  roomId: string,
  questionId: string,
  userId: string,
  answer: string,
  correct: boolean,
  milisecondsTaken: number
) {
  const key = `trivia:${roomId}:answers:${questionId}`
  const value = JSON.stringify({ answer, correct, milisecondsTaken })

  await redis.hset(key, userId, value)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log(searchParams.get('id'))

  try {
    // return NextResponse.json(data)
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.log('error', error)
    return NextResponse.json({ error: 'Error al obtener los datos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { triviabId } = await request.json()
    if (!triviabId) return NextResponse.json({ error: 'It is required to provide a valid ID' }, { status: 400 })

    const roomKey = `triviab:${triviabId}`
    const roomData = {
      status: 'waiting',
      host: null,
      current_question: null,
      questions: [],
      players: {}
    }

    await redis.hset(roomKey, roomData)

    return NextResponse.json({ status: 'ok', message: 'Room created' })
  } catch (error) {
    console.log('error', error)
    return NextResponse.json({ error: 'Error creating room' }, { status: 500 })
  }
}
