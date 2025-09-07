export interface Triviab {
    id: string
    title: string
    slides: Slide[]
    action: Action
  }
  
  export interface Slide {
    id: string
    question: string
    type: SlideType
    options: Option[]
    correctOption: string | null
    action: Action
  }
  
  export interface Option {
    id: string
    option: string
    action: Action
  }
  
  export type Action = 'added' | 'removed' | 'updated' | 'saved'
  
  export enum SlideType {
    MULTICHOICE = 'Multichoice',
    TRUEFALSE = 'True/False'
  }
  
  // Websocket
  export enum cmdType {
      OPEN = '/open',
      CLOSE = '/close',
      MESSAGE = '/message',
      JOIN = '/join',
      LEAVE = '/leave',
      OPEN_ROOM = '/openroom',
      CLIENT_COUNT = '/client-count'
    }
  
  export interface CommandType {
    cmd: cmdType
    userId: string
    triviabId: string
    message: string | null
  }
  
  // ===== Redis =====
  export interface Player {
    score: number
  }
  
  export interface Question {
    question: string
    options: string[]
    answer: number // Índice de la respuesta correcta
  }
  
  export interface TriviaRoom {
    status: 'waiting' | 'in_progress' | 'finished'
    host: string
    current_question: number
    questions: Question[]
    players: Record<string, Player> // Objeto donde la clave es el ID del jugador
  }
  