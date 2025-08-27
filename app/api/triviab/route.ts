import 'server-only'
import type { Option, Slide, Triviab, SlideType } from '@/types.ts'
import { NextRequest, NextResponse } from 'next/server'
import { turso, type ResultSet } from '@/lib/turso'
import { randomUUID } from 'crypto'

export async function getTriviab(id: string): Promise<Triviab | null> {
  // Obtener trivia
  const triviaRes = await turso.execute({
    sql: 'SELECT id, title FROM trivia WHERE id = ?',
    args: [id]
  })

  if (triviaRes.rows.length === 0) {
    return null // No existe
  }

  const triviaRow = triviaRes.rows[0]

  // Obtener slides
  const slidesRes = await turso.execute({
    sql: 'SELECT id, question, type, position, correct_option_id FROM slide WHERE trivia_id = ? ORDER BY position ASC',
    args: [id]
  })

  const slides: Slide[] = []

  for (const slideRow of slidesRes.rows) {
    // Obtener opciones de cada slide
    const optionsRes = await turso.execute({
      sql: 'SELECT id, option, position FROM option WHERE slide_id = ? ORDER BY position ASC',
      args: [slideRow.id]
    })

    const options: Option[] = optionsRes.rows.map((opt) => ({
      id: String(opt.id),
      option: String(opt.option),
      action: 'saved'
    }))

    // Buscar el índice de la opción correcta
    const correctIndex = slideRow.correct_option_id ? String(slideRow.correct_option_id) : null

    slides.push({
      id: String(slideRow.id),
      question: String(slideRow.question),
      type: String(slideRow.type) as SlideType,
      options,
      correctOption: correctIndex,
      action: 'saved'
    })
  }

  return {
    id: String(triviaRow.id),
    title: String(triviaRow.title),
    slides,
    action: 'saved'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  console.log(searchParams.get('id'))

  const id = searchParams.get('id')

  if (!id) {
    const result = await turso.execute({
      sql: 'SELECT * FROM trivia'
    })
    console.log('El resultado es: ', result.rows)
    return NextResponse.json(result.rows.map((triviab) => ({ id: triviab.id, title: triviab.title })))
  } else {
    const result = await getTriviab(id)
    return NextResponse.json(result)
  }
}

export async function POST(request: NextRequest) {
  const triviab: Triviab = await request.json()
  const tx = await turso.transaction()

  console.log('Lo que quiero guardar en la abse de datos es: ', triviab)

  try {
    // === Trivia ===
    if (triviab.id && triviab.id !== '') {
      // UPDATE si action es updated
      if (triviab.action === 'updated') {
        await tx.execute({
          sql: 'UPDATE trivia SET title = ? WHERE id = ?',
          args: [triviab.title, triviab.id]
        })
      }
      // DELETE si action es removed
      else if (triviab.action === 'removed') {
        await tx.execute({
          sql: 'DELETE FROM trivia WHERE id = ?',
          args: [triviab.id]
        })
      }
      // saved → no hacer nada
    } else {
      // INSERT (added)
      const triviaId = randomUUID()
      triviab.id = triviaId
      await tx.execute({
        sql: 'INSERT INTO trivia (id, title) VALUES (?, ?)',
        args: [triviab.id, triviab.title]
      })
    }

    // === Slides ===
    for (let slideIndex = 0; slideIndex < triviab.slides.length; slideIndex++) {
      const slide = triviab.slides[slideIndex]

      const correctOptionUuid = randomUUID()

      // --- Slide: ADDED ---
      if (slide.action === 'added') {
        slide.id = randomUUID()
        await tx.execute({
          sql: 'INSERT INTO slide (id, trivia_id, question, type, position, correct_option_id) VALUES (?, ?, ?, ?, ?, ?)',
          args: [slide.id, triviab.id, slide.question, slide.type, slideIndex, correctOptionUuid]
        })
      }
      // --- Slide: UPDATED ---
      else if (slide.action === 'updated') {
        await tx.execute({
          sql: 'UPDATE slide SET question = ?, type = ?, position = ?, correct_option_id = ? WHERE id = ?',
          args: [slide.question, slide.type, slideIndex, slide.correctOption, slide.id]
        })
      }
      // --- Slide: REMOVED ---
      else if (slide.action === 'removed') {
        await tx.execute({
          sql: 'DELETE FROM slide WHERE id = ?',
          args: [slide.id]
        })
        continue // no procesar opciones
      }
      // --- Slide: SAVED --- → no se hace nada

      // === Opciones ===
      for (let optIndex = 0; optIndex < slide.options.length; optIndex++) {
        const option = slide.options[optIndex]
        console.log('La option es: ', option)
        if (option.action === 'added') {
          option.id = slide.correctOption === option.id ? correctOptionUuid : randomUUID()

          await tx.execute({
            sql: 'INSERT INTO option (id, slide_id, option, position) VALUES (?, ?, ?, ?)',
            args: [option.id, slide.id, option.option, optIndex]
          })
        } else if (option.action === 'updated') {
          await tx.execute({
            sql: 'UPDATE option SET option = ?, position = ? WHERE id = ?',
            args: [option.option, optIndex, option.id]
          })
        } else if (option.action === 'removed') {
          await tx.execute({
            sql: 'DELETE FROM option WHERE id = ?',
            args: [option.id]
          })
          continue
        }
      }
    }

    await tx.commit()
    return NextResponse.json({ success: true, id: triviab.id })
  } catch (error) {
    console.error('Error saving trivia:', error)
    await tx.rollback()
    return NextResponse.json({ success: false, error: 'Failed to save trivia' }, { status: 500 })
  }
}
