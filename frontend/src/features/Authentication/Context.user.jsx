import { createContext } from 'react'
import { useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const userContext = createContext()

export const UserProvider = ({children}) => {
    const [user , setUser] = useState(null)
  return (
    <userContext.Provider value={{user , setUser}}>
      {children}
    </userContext.Provider>
    
  )
}
