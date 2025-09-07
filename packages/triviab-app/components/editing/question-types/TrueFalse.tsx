import DislikeIcon from '@app/components/icons/Dislike'
import LikeIcon from '@app/components/icons/Like'
import { useTriviabState } from '@app/state/triviab'
import { useShallow } from 'zustand/react/shallow'


interface Props{
correctOptionId: string
  slideId: string
}

export default function TrueFalse({ correctOptionId, slideId }: Props) {

  const setCorrectOption = useTriviabState((state) => state.setCorrectOption)
  const options = useTriviabState(useShallow((state) => state.options.filter((option) => option.slideId === slideId)))
  return (
    <>
      <li className="flex gap-5">
        <span className="px-5 py-3 flex-1 rounded-lg border border-secondary/50">
          It&apos;s true
        </span>
        <label
          htmlFor={`trueGroup${slideId}`}
          className="flex items-center gap-2 border border-negative rounded-lg px-5 py-3 bg-negative/30  has-checked:bg-primary/30 has-checked:border-primary"
        >
          <input
            type="radio"
            hidden
            id={`trueGroup${slideId}`}
            name={`isCorrectQuestion${slideId}`}
            value={0}
            className="peer"
            checked={correctOptionId === options[0].id}
            onChange={() => {
              setCorrectOption(slideId, options[0].id)
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
      <li className="flex gap-5">
        <span className="px-5 py-3 flex-1 rounded-lg border border-secondary/50">
          It&apos;s false
        </span>
        <label
          htmlFor={`falseGroup${slideId}`}
          className="flex items-center gap-2 border border-negative rounded-lg px-5 py-3 bg-negative/30  has-checked:bg-primary/30 has-checked:border-primary"
        >
          <input
            type="radio"
            hidden
            id={`falseGroup${slideId}`}
            name={`isCorrectQuestion${slideId}`}
            value={1}
            className="peer"
            checked={correctOptionId === options[1].id}
            onChange={() => {
              setCorrectOption(slideId, options[1].id)
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
    </>
  )
}
