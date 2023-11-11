import React, { useState,useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import { db } from '../Api/firebaseConfig';

export function Ingresos() {


  const navigate = useNavigate();
  const [ingresos, setIngresos] = useState([]);
 

  useEffect(() => {
    // Obtener datos de Firebase para Ingresos
    const unsubscribe = db.collection('Ingresos').onSnapshot((snapshot) => {
      const nuevosIngresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIngresos(nuevosIngresos);
    });
    // Limpia la suscripción cuando la vista se desmonta
    return () => {
      unsubscribe();
    };
  }, []);

  

  const handleEditarIngreso = (id) => {
    // Redirigir al usuario a la vista de edición con el ID del ingreso
    navigate(`/editarIngreso/${id}`);
  };

  const handleEliminarIngreso = (id) => {
    // Eliminar el ingreso de la base de datos
    db.collection('Ingresos')
      .doc(id)
      .delete()
      .then(() => {
        // Actualizar la lista de ingresos
        const nuevosIngresos = ingresos.filter((ingreso) => ingreso.id !== id);
       
      });
    };



  return (

    <section>
      <div class="container">
      <div className='grid'>
          <div>
            <h1 style={{textAlign:'center'}}>Ingresos</h1>
            <p class="text-h3 text-center">Agrega un nuevo ingreso nueva para administrar mejor tu dinero! </p>
            <br></br>
         <Link to='/IngresosTabla' className='btn btn-success btn-lg ms-2'>
          <i className='fa fa-plus-circle me-2' ></i>
          Agregar</Link>
          <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple'}}>
          <i class="fa-solid fa-circle-arrow-left me-2" ></i>
          Regresar</Link>
          </div>
            </div>
           
    <div className="row align-items-center mt-4">
    <div className="col">

      <table className="table table-hover mt-3">
        <thead>
          <tr class="table-success">
            <th>Fecha</th>
            <th>Ingreso</th>
            <th>Cuenta</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {ingresos.map((ingreso) => (
                      <tr key={ingreso.id}>
                        <td>{ingreso.fecha}</td>
                        <td>{ingreso.ingreso}</td>
                        <td>{ingreso.cuentaInstitucion}</td>
                        <td>{ingreso.valor}</td>
                        <td className='align-items-center'>
                          <button
                           className="btn btn-primary my-1 ms-2"
                            onClick={() => handleEditarIngreso(ingreso.id)}
                          >
                            <i className='fa fa-pen'></i>
                          </button>
                          <button
                             className="btn btn-danger my-1 ms-2"
                            onClick={() => handleEliminarIngreso(ingreso.id)}
                          >
                             <i className='fa fa-trash'></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                   </tbody>
                </table>
              </div>
            </div>              
            </div>
            </section>
  )
}

export default Ingresos