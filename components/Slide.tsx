import type { Slide } from '@/types.ts'
export default function Slide({ slide }: { slide: Slide }) {
  return (
    <section className="my-10 mx-15 bg-secondary flex-1 rounded-2xl flex flex-col">
      <h2 className="font-bold text-2xl md:text-4xl text-center py-10 mx-10 text-text-secondary">{slide.title}</h2>
      <p className="text-center text-2xl md:text-5xl py-10 text-balance">{slide.question}</p>
      <ul className="grid grid-cols-2 grid-rows-2 gap-6 p-10 items-center justify-items-center flex-1">
        {slide.options.map((option) => (
          <li key={option.id} className="w-full h-full list-none">
            <input id={option.id.toString()} className='peer' type="radio" name="option" hidden value={option.option} />
            <label htmlFor={option.id.toString()} className="peer-checked:border-green-400 border-tertiary inline-block  w-full h-full text-2xl md:text-3xl border-2 rounded-2xl px-4 py-2 hover:border-green-300 transition-transform active:scale-95">
              {option.option}
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
