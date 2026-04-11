import { createContext, useContext } from 'react'

export const PlanningModalContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggleTheme: () => {},
})

export const usePlanningModal = () => useContext(PlanningModalContext)
