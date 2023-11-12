import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../Api/firebaseConfig';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Objetivos() {

  const [objetivos, setObjetivos] = useState([]);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState(null);
  const [modal, setModal] = useState(false);

  //notificaciones
  const notify = () => {
    toast.success("Editado con exito!")
  };
  const notifyDelete = () => {
    toast.error("Eliminado con exito!")
  };

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

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (objetivo) => {
    setObjetivoSeleccionado(objetivo);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setObjetivoSeleccionado(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    try {
      // Eliminar la cuenta de Firebase
      await db.collection('Objetivos').doc(id).delete();
      console.log('Objetivo eliminada exitosamente');
      notifyDelete(); // Llamada a la función notify después de la actualización exitosa
    } catch (error) {
      console.error('Error al eliminar el Objetivo', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await db.collection('Objetivos').doc(objetivoSeleccionado.id).update(objetivoSeleccionado);
      console.log('Objetivo actualizado exitosamente');
      notify(); // Llamada a la función notify después de la actualización exitosa
      setObjetivoSeleccionado(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar el Objetivo', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjetivoSeleccionado((prevObjetivo) => ({ ...prevObjetivo, [name]: value }));
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
                <div className={`card ${objetivo.cumplido ? 'bg-success' : 'bg-danger' }`}>
                  <div className='card-body' style={{ backgroundColor: objetivo.cumplido ? '#9cc4e4' : '#dd5866' }}>
                    <div className='row align-items-center d-flex jutify-content-around'>
                      <div className='col-md-4'>
                        <img src='https://cdn.icon-icons.com/icons2/2508/PNG/512/business_money_earnings_target_icon_150721.png' alt='' className='cuenta-image'></img>
                      </div>
                      <div className='col-md-7'>
                        <ul className='list-group'>
                          <li className='list-group-item list-group-item-action'>
                            <b>Objetivo:</b> <span>{objetivo.objetivo}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Fecha de Inicio:</b> <span>{objetivo.fechaInicio}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Fecha Final:</b> <span>{objetivo.fechaFinal}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Descripción:</b> <span>{objetivo.descripcion}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Valor:</b> <span>{objetivo.valorObjetivo}</span>
                          </li>
                        </ul>
                      </div>
                      <div className='col-md-1 d-flex flex-column align-items-center'>
                        {objetivo.cumplido ? (
                          <span className="text-white large-icon"><b>🔓</b></span>
                        ) : (
                          <button className="btn btn-success my-1" onClick={() => handleObjetivoCumplido(objetivo.id)}>
                            <i className="fa fa-check"></i>
                          </button>
                        )}
                        {/* editar */}
                        <button
                          onClick={() => handleEditar(objetivo)}
                          className='btn btn-primary my-1'
                        >
                          <i className='fa fa-pen'></i>
                        </button>
                        
                        <button
                         className='btn btn-danger my-1' 
                         onClick={() => handleEliminar(objetivo.id)}>
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
      {/* Modal de Edición */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>Editar Cuenta</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='objetivo' className='form-label'>
                Nombre del objetivo:
              </label>
              <input
                type='text'
                className='form-control'
                id='objetivo'
                name='objetivo'
                value={objetivoSeleccionado ? objetivoSeleccionado.objetivo : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='objetivo' className='form-label'>
                Fecha de inicio:
              </label>
              <input
                type='date'
                className='form-control'
                id='fechaInicio'
                name='fechaInicio'
                value={objetivoSeleccionado ? objetivoSeleccionado.fechaInicio : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='objetivo' className='form-label'>
                Fecha de final:
              </label>
              <input
                type='date'
                className='form-control'
                id='fechaFinal'
                name='fechaFinal'
                value={objetivoSeleccionado ? objetivoSeleccionado.fechaFinal : ''}
                onChange={handleChange}

              />

              <label htmlFor='objetivo' className='form-label'>
              Descripcion:
              </label>
              <input
                type='text'
                className='form-control'
                id='descripcion'
                name='descripcion'
                value={objetivoSeleccionado ? objetivoSeleccionado.descripcion : ''}
                onChange={handleChange}

              />

              <label htmlFor='objetivo' className='form-label'>
              Valor:
              </label>
              <input
                type='text'
                className='form-control'
                id='valorObjetivo'
                name='valorObjetivo'
                value={objetivoSeleccionado ? objetivoSeleccionado.valorObjetivo : ''}
                onChange={handleChange}

              />
            </div>
            {/* Agrega más campos según tus necesidades */}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'green' }}
            onClick={handleGuardarEdicion}>
            Guardar
          </Button>
          <Button
            className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}
            onClick={handleCancelarEdicion}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer /> {/* Agrega este componente para mostrar las notificaciones */}
    </React.Fragment>
  )
}

export default Objetivos