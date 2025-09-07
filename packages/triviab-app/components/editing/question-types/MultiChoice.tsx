import DislikeIcon from '@app/components/icons/Dislike'
import LikeIcon from '@app/components/icons/Like'
import { useTriviabState } from '@app/state/triviab'
import { Action } from '@triviab/types'
import {useShallow} from 'zustand/react/shallow'

export default function MultiChoice({
  correctOptionId,
  slideId,
}: {
  correctOptionId: string
  slideId: string
}) {
  const options = useTriviabState(useShallow((state) => state.options.filter((option) => option.slideId === slideId)))
  console.log('Las options son: ',options)
  const updateOption = useTriviabState(useShallow((state) => state.updateOption))
  const setCorrectOption = useTriviabState(useShallow((state) => state.setCorrectOption))
  
  return options && options.map((option) => (
    <li key={option.id} className="flex gap-5">
      <input
        id={`option${option.id}Group${slideId}`}
        name={`option${option.id}Group${slideId}`}
        value={option.option || ''}
        onChange={(e) => {
          const newAction: Action = option.action === 'saved' ? 'updated' : option.action
          if(!options) return
          updateOption({
            id: option.id,
            option: e.target.value,
            action: newAction,
            slideId
          })
        }}
        data-id={option.id}
        type="text"
        placeholder="Write your option"
        className="px-5 py-3 flex-1 rounded-lg border border-secondary/50 focus:outline-none focus:border-b-2 focus:border-b-tertiary"
      />
      <label
        htmlFor={`isCorrectOpt${option.id}Group${slideId}`}
        className="flex items-center gap-2 border border-negative rounded-lg px-5 py-3 bg-negative/30  has-checked:bg-primary/30 has-checked:border-primary"
      >
        <input
          type="radio"
          hidden
          id={`isCorrectOpt${option.id}Group${slideId}`}
          name={`isCorrectQuestion${slideId}`}
          value={option.id}
          className="peer"
          checked={option.id === correctOptionId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if(e.target.checked) setCorrectOption(slideId, option.id)
          }}
        />
        <span className="hidden peer-checked:inline">
          <LikeIcon />
        </span>
        <span className="peer-checked:hidden">
          <DislikeIcon />
        </span>
      </label>
    </li>
  ))
}
