import { TriviabState, ActionOption, ActionSlide } from '@/state/types'
import { Action, SlideType } from '@/types.ts'
import { create } from 'zustand'

export const useTriviabState = create<TriviabState>((set, get) => ({
  triviabId: '',
  triviaTitle: '',
  slides: [],
  options: [],
  action: 'saved',

  setTriviabId: (triviabId: string) => set({ triviabId }),
  setTitle: (triviaTitle: string) => set({ triviaTitle }),
  setTriviabAction: (action: Action) => set({ action }),
  getTriviab: () => {
    const slides = get().slides.map((slide) => {
      const options = get().options.filter((option: ActionOption) => option.slideId === slide.id)
      return {
        ...slide,
        options: options
      }
    })

    return {
      id: get().triviabId,
      title: get().triviaTitle,
      slides,
      action: get().action
    }
  },

  resetTriviab: () => set({ triviabId: '', triviaTitle: '', slides: [], options: [] }),
  addSlide: (slide: ActionSlide | ActionSlide[]) =>
    set((state) => {
      const newSlides = [...state.slides]
      if (Array.isArray(slide)) {
        newSlides.push(...slide)
      } else {
        newSlides.push(slide)
      }
      return { slides: newSlides }
    }),
  removeSlide: (slideId: string) =>
    set((state) => ({
      slides: state.slides.map((slide) => (slide.id === slideId ? { ...slide, action: 'removed' } : slide))
    })),
  updateSlide: (slideUpdated: ActionSlide) =>
    set((state) => ({ slides: state.slides.map((slide) => (slide.id === slideUpdated.id ? slideUpdated : slide)) })),
  addOption: (option: ActionOption | ActionOption[]) =>
    set((state) => {
      const newOptions = [...state.options]
      if (Array.isArray(option)) {
        newOptions.push(...option)
      } else {
        newOptions.push(option)
      }
      return { options: newOptions }
    }),
  removeOption: (optionId: string) =>
    set((state) => ({ options: state.options.map((option) => (option.id === optionId ? { ...option, action: 'removed' } : option)) })),
  updateOption: (optionUpdated: ActionOption) =>
    set((state) => ({
      options: state.options.map((option) => (option.id === optionUpdated.id ? optionUpdated : option))
    })),
  setCorrectOption: (slideId: string, optionId: string) =>
    set((state) => ({
      slides: state.slides.map((slide) => (slide.id === slideId ? { ...slide, correctOption: optionId } : slide))
    })),
  setTypeSlide: (slideId: string, type: SlideType) =>
    set((state) => {
      const currentOptionsAction = state.options.find((option) => option.slideId === slideId)?.action
      let currentOptions = [...state.options]
      if (currentOptionsAction === 'saved' || currentOptionsAction === 'updated') {
        currentOptions = state.options.map((option) =>
          option.slideId === slideId ? { ...option, action: 'removed' } : option
        )
      }
      const newOptions = [...currentOptions.filter((option) => option.slideId !== slideId || option.action !== 'added')]
      if (type === SlideType.MULTICHOICE) {
        newOptions.push(
          ...(Array.from({ length: 4 }, (_, i) => ({
            id: `${slideId}-${i}`,
            option: '',
            action: 'added',
            slideId: slideId
          })) as ActionOption[])
        )
      } else if (type === SlideType.TRUEFALSE) {
        newOptions.push(
          ...(Array.from(['True', 'False'], (v, i) => ({
            id: `${slideId}-${i}`,
            option: v,
            action: 'added',
            slideId: slideId
          })) as ActionOption[])
        )
      }
      return {
        slides: state.slides.map((slide) => (slide.id === slideId ? { ...slide, type } : slide)),
        options: newOptions
      }
    })
}))
