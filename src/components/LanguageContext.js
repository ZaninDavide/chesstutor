import React, { createContext } from "react"

export const LanguageContext = createContext()

export const LanguageProvider = props => {
  return <LanguageContext.Provider value={{ lang: props.lang }}>{props.children}</LanguageContext.Provider>
}
