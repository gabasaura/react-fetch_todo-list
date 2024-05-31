import React from 'react'
import { FaTrash } from "react-icons/fa";


const Tarea = ({id, texto, borrarTarea}) => {
    return (
        <div className='contenedor-tarea'>
            <div className='txt-tarea'>
                {texto}
            </div>
            <div className='contenedor-icono'>
            <FaTrash 
            className='icono-borrar'
            onClick={ () => borrarTarea(id)} />
            </div>
        </div>
    )
}

export default Tarea