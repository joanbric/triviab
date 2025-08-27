import type { Triviab, Slide, Option, SlideType, Action } from '@/types.ts'

export interface ActionOption extends Option {
  slideId: string
}

export type ActionSlide = Omit<Slide, 'options'>


export interface TriviabState {
  triviaTitle: string,
  triviabId: string,
  slides: ActionSlide[],
  options: ActionOption[],
  action: Action,
  
  setTriviabId: (triviabId: string) => void,
  setTitle: (title: string) => void,
  setTriviabAction: (action: Action) => void,
  getTriviab: () => Triviab,
  resetTriviab: () => void,
  addSlide: (slide: ActionSlide | ActionSlide[]) => void,
  removeSlide: (slideId: string) => void,
  updateSlide: (slide: ActionSlide) => void,
  addOption: (option: ActionOption | ActionOption[]) => void,
  removeOption: (optionId: string) => void,
  updateOption: (option: ActionOption) => void,
  setCorrectOption: (slideId: string, optionId: string) => void,
  setTypeSlide: (slideId: string, type: SlideType) => void
}