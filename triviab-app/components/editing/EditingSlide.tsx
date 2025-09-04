'use client'
import MultiChoice from './question-types/MultiChoice'
import TrueFalse from './question-types/TrueFalse'
import { Action, SlideType } from '@/types'
import { useTriviabState } from '@app/state/triviab'
import { ActionSlide } from '@app/state/types'
import { useShallow } from 'zustand/shallow'
import DeleteIcon from '@app/components/icons/Delete'

export default function EditingSlide({ slide }: { slide: ActionSlide }) {
  const updateSlide = useTriviabState(useShallow((state) => state.updateSlide))
  const setTypeSlide = useTriviabState(useShallow((state) => state.setTypeSlide))
  const removeSlides = useTriviabState(useShallow((state) => state.removeSlide))

  return (
    <section className="border-2  bg-indigo-950 border-secondary rounded-2xl pb-5 min-w-lg select-none overflow-hidden">
      <header className="flex justify-between items-center gap-5 mb-5 py-5 px-10 bg-secondary/20">
        <textarea
          placeholder="Write your question"
          id={`question${slide.id}`}
          name={`question${slide.id}`}
          className="px-5 py-3 text-xl rounded-lg border border-secondary/50 flex-1 resize-none overflow-y-hidden auto-height max-row-height-[2] focus:outline-none focus:border-b-2 focus:border-b-tertiary"
          rows={1}
          maxLength={500}
          value={slide.question}
          onChange={(e) => {
            const newAction: Action = slide.action === 'saved' ? 'updated' : slide.action
            updateSlide({
              ...slide,
              question: e.target.value,
              action: newAction
            })
          }}
        />
        <select
          onChange={(e) => {
            setTypeSlide(slide.id, e.target.value as SlideType)
          }}
          name={`type${slide.id}`}
          id={`type${slide.id}`}
          className="px-5 py-3 rounded-lg border border-secondary/50"
          defaultValue={SlideType.MULTICHOICE}
        >
          {Object.values(SlideType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button onClick={() => removeSlides(slide.id)} className="p-3 rounded-lg border border-negative bg-negative hover:bg-negative/80 hover:text-white transition-colors">
          <DeleteIcon />
        </button>
      </header>
      <ul className="px-10 flex flex-col gap-5">
        {slide.type === SlideType.MULTICHOICE ? (
          <MultiChoice correctOptionId={slide.correctOption || '0'} slideId={slide.id} />
        ) : null}

        {slide.type === SlideType.TRUEFALSE ? (
          <TrueFalse correctOptionId={slide.correctOption || '0'} slideId={slide.id} />
        ) : null}
      </ul>
    </section>
  )
}
