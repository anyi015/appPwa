import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../Api/firebaseConfig';

export function Objetivos() {

  const [objetivos, setObjetivos] = useState([])

  useEffect(() => {
    // Obtener datos de Firebase
    const unsubscribe = db.collection('Objetivos').onSnapshot((snapshot) => {
      const nuevoObjetivo = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        nuevoObjetivo.push({ id: doc.id, ...data });
      });
      setObjetivos(nuevoObjetivo);
    });


    // Limpia la suscripción cuando la vista se desmonta
    return () => unsubscribe();
  }, []);

  // Función para marcar el objetivo como cumplido
  const handleObjetivoCumplido = (objetivoId) => {
    // Implementa la lógica para marcar el objetivo como cumplido (por ejemplo, actualiza el estado de cumplido)
  // Encuentra el objetivo correspondiente por su ID
  const objetivo = objetivos.find((objetivo) => objetivo.id === objetivoId);

  if (objetivo) {
    // Marca el objetivo como cumplido en el estado local
    objetivo.cumplido = true;

    // Actualiza el objetivo en la base de datos (Firestore)
    db.collection('Objetivos')
      .doc(objetivoId)
      .update({ cumplido: true })
      .then(() => {
        // Éxito: El objetivo se ha marcado como cumplido en la base de datos
        console.log('Objetivo marcado como cumplido con éxito');
        // Si deseas realizar más acciones después de marcarlo como cumplido, aquí es el lugar.
      })
      .catch((error) => {
        // Error al actualizar en la base de datos
        console.error('Error al marcar el objetivo como cumplido:', error);
        // Si es necesario, maneja el error de acuerdo a tus necesidades.
      });
  }
};

const handleEliminarObjetivo = (id) => {
  // Eliminar el ingreso de la base de datos
  db.collection('Objetivos')
    .doc(id)
    .delete()
    .then(() => {
      // Actualizar la lista de ingresos
      const nuevoObjetivo = objetivos.filter((objetivo) => objetivo.id !== id);
     
    });
  };

  

  return (



    <React.Fragment>
      <section>
        <div className='container'>
          <div className='grid'>
            <div>
              <h1 style={{ textAlign: 'center' }}>Objetivos</h1>
              <p class="text-h3 text-center">Agrega un nuevo Objetivo y administra mejor tu dinero! </p>
              <br></br>
              <Link to='/ObjetivosTabla' className='btn btn-success btn-lg ms-2'>
                <i className='fa fa-plus-circle me-2' ></i>
                Agregar</Link>
              <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
                <i class="fa-solid fa-circle-arrow-left me-2" ></i>
                Regresar</Link>
            </div>
          </div>
        </div>
      </section>
      <section className='gasto-list'>
        <div className='container'>
          <div className='row'>
            {objetivos.map((objetivo) => (
              <div key={objetivo.id} className='col-md-6'>
                <div className={`card ${objetivo.cumplido ? 'bg-success' : 'bg-danger'}`}>
                  <div className='card-body'>
                    <div className='row align-items-center d-flex jutify-content-around'>
                      <div className='col-md-4'>
                        <img src='https://cdn.icon-icons.com/icons2/2508/PNG/512/business_money_earnings_target_icon_150721.png' alt='' className='cuenta-image'></img>
                      </div>
                      <div className='col-md-7'>
                        <ul className='list-group'>
                          <li className='list-group-item list-group-item-action'>
                            Objetivo: <span>{objetivo.objetivo}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            Fecha de Inicio: <span>{objetivo.fechaInicio}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            Fecha Final: <span>{objetivo.fechaFinal}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            Descripcionl: <span>{objetivo.descripcion}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            Valor: <span>{objetivo.valorObjetivo}</span>
                          </li>
                        </ul>
                      </div>
                      <div className='col-md-1 d-flex flex-column align-items-center'>
                      {objetivo.cumplido ? (
                        <span className="text-white">Cumplido</span>
                        ) : (
                          <button className="btn btn-success my-1" onClick={() => handleObjetivoCumplido(objetivo.id)}>
                            <i className="fa fa-check"></i>
                          </button>
                           )}
                        <Link className='btn btn-primary my-1'>
                          <i className='fa fa-pen'></i>
                        </Link> 
                        <button className='btn btn-danger my-1' onClick={() => handleEliminarObjetivo(objetivo.id)}>
                          <i className='fa fa-trash'></i>
                        </button>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}

export default Objetivos