'use client'
import EditingSlide from '@/components/editing/EditingSlide'
import { Triviab, Slide, Option, SlideType } from '@/types'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTriviabState } from '@/state/triviab'
import type { ActionSlide } from '@/state/types'
import { useShallow } from 'zustand/react/shallow'

export default function EditTriviabPage() {
  const params = useParams()
  const slides = useTriviabState(useShallow((state) => state.slides))
  const title = useTriviabState(useShallow((state) => state.triviaTitle))
  const addSlide = useTriviabState(useShallow((state) => state.addSlide))
  const setTriviabId = useTriviabState(useShallow((state) => state.setTriviabId))
  const setTitle = useTriviabState(useShallow((state) => state.setTitle))
  const addOption = useTriviabState(useShallow((state) => state.addOption))
  const resetTriviab = useTriviabState(useShallow((state) => state.resetTriviab))
  const setTriviabAction = useTriviabState(useShallow((state) => state.setTriviabAction))
  const action = useTriviabState(useShallow((state) => state.action))
  const getTriviab = useTriviabState(useShallow((state) => state.getTriviab))

  const id = params.id

  useEffect(() => {
    if (!id) return

    fetch(`http://localhost:3000/api/triviab?id=${id}`)
      .then((res) => res.json())
      .then((data: Triviab) => {
        console.log(data)
        addSlide(
          data.slides.map((slide: Slide) => ({
            id: slide.id,
            question: slide.question,
            type: slide.type as SlideType,
            correctOption: slide.correctOption,
            action: 'saved'
          })) as ActionSlide[]
        )
        setTriviabId(data.id)
        setTriviabAction('saved')
        data.slides.forEach((slide: Slide) => {
          addOption(
            slide.options.map((option: Option) => ({
              ...option,
              action: 'saved',
              slideId: slide.id
            }))
          )
        })
        setTitle(data.title)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const triviab = getTriviab()
      const res = await fetch('http://localhost:3000/api/triviab', {
        method: 'POST',
        body: JSON.stringify(triviab)
      })
      if (res.ok) {
        const data = await res.json()

        if (!id) window.location.href = `/triviab/edit/${data.id}`

        console.log('La respuesta al guardarlos es: ', data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Editar Triviab</h1>
      <main className="px-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-4xl mx-auto  my-10">
          <header className="flex justify-end gap-5 py-10 bg-secondary/20 rounded-2xl px-10 sticky top-3 z-10 backdrop-blur-md">
            <textarea
              className="px-5 py-3 text-xl rounded-lg border border-secondary/50 flex-1 resize-none overflow-y-hidden auto-height max-row-height-[2] focus:outline-none focus:border-b-2 focus:border-b-tertiary"
              name="title"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (action === 'saved') setTriviabAction('updated')
              }}
            ></textarea>
            <button
              type="button"
              onClick={() => {
                const newSlideId = slides.length.toString()
                addSlide({
                  id: newSlideId,
                  question: '',
                  type: SlideType.MULTICHOICE,
                  correctOption: null,
                  action: 'added'
                })

                addOption(
                  Array.from({ length: 4 }, (_, i) => ({
                    id: `${newSlideId}-${i}`,
                    option: '',
                    action: 'added',
                    slideId: newSlideId
                  }))
                )
              }}
              className="bg-secondary text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              Add slide
            </button>
            <button
              type="button"
              onClick={() => {
                resetTriviab()
              }}
              className="bg-secondary text-white px-4 py-2 rounded hover:cursor-pointer"
            >
              Clear Triviab
            </button>
            <button type="submit" className="bg-secondary text-white px-4 py-2  rounded hover:cursor-pointer">
              Save Triviab
            </button>
          </header>
          {slides.filter((slide) => slide.action !== 'removed').map((slide: ActionSlide) => (
            <EditingSlide key={slide.id} slide={slide} />
          ))}
        </form>
      </main>
    </div>
  )
}
