import { create } from 'zustand'

interface ScoreStateProps {
    score: number;
    increaseScore: () => void;
}

interface Counter {
  count: number;
  increaseCount: () => void;
  resetCount: () => void;
}


export const useScoreStore = create<ScoreStateProps>((set) => ({
  score: 0,
  increaseScore: () => set((state: { score: number }) => ({ score: state.score + 1 })),
}))

export const useAnswerCounterStore = create<Counter>((set) => ({
  count: 0, 
  increaseCount: () => set((state: { count: number }) => ({ count: state.count + 1 })),
  resetCount: () => set(() => ({ count: 0}))
}))