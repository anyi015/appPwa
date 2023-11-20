import { useState, useContext, createContext } from 'react'

const WebContext = createContext()

export function AppProvider({ children }) {

    const [Mostrar_Mensaje, set_Mostrar_Mensaje] = useState(true)
    
    // const [administrandoWeb, setAdministrandoWeb] = useState('Sin_Administrador')
    return (
        <WebContext.Provider value={{ Mostrar_Mensaje, set_Mostrar_Mensaje}}>
            {children}
        </WebContext.Provider>
    )
}


export function OcupoContexto() {
    return useContext(WebContext);
}