import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const QuoteContext = createContext(null)

/**
 * Provides openQuote()/closeQuote() so the navbar, hero, and contact CTAs can
 * all open the same Get Quote modal. `prefill` optionally seeds the service.
 */
export function QuoteProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)

  const openQuote = useCallback((prefillData = null) => {
    setPrefill(prefillData)
    setIsOpen(true)
  }, [])

  const closeQuote = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, prefill, openQuote, closeQuote }),
    [isOpen, prefill, openQuote, closeQuote]
  )

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
