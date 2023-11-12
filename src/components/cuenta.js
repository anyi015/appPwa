import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../Api/firebaseConfig';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Cuenta() {


  const [cuentas, setCuentas] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [modal, setModal] = useState(false);

  const notify = () => {
    toast.success("Editado con exito!")
};
const notifyDelete = () => {
  toast.error("Eliminado con exito!")
};



  // Obtener datos de Firebase
  useEffect(() => {
    const unsubscribe = db.collection('cuentas').onSnapshot((snapshot) => {
      const nuevaCuenta = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        nuevaCuenta.push({ id: doc.id, ...data });
      });
      setCuentas(nuevaCuenta);
    });


    // Limpia la suscripción cuando la vista se desmonta
    return () => unsubscribe();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (cuenta) => {
    setCuentaSeleccionada(cuenta);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setCuentaSeleccionada(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    try {
      // Eliminar la cuenta de Firebase
      await db.collection('cuentas').doc(id).delete();
      console.log('Cuenta eliminada exitosamente');
      notifyDelete(); // Llamada a la función notify después de la actualización exitosa
    } catch (error) {
      console.error('Error al eliminar la cuenta', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await db.collection('cuentas').doc(cuentaSeleccionada.id).update(cuentaSeleccionada);
      console.log('Cuenta actualizada exitosamente');
      notify(); // Llamada a la función notify después de la actualización exitosa
      setCuentaSeleccionada(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar la cuenta', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCuentaSeleccionada((prevCuenta) => ({ ...prevCuenta, [name]: value }));
  };



  return (



    <React.Fragment>
      <section>
        <div className='container'>
          <div className='grid'>
            <div>

              <h1 style={{ textAlign: 'center' }}>Cuentas</h1>
              <p class="text-h3 text-center">Agrega una cuenta nueva para administrar mejor tu dinero! </p>
              <br></br>
              <Link to={'/NCuentaTabla'} className='btn btn-success btn-lg ms-2'>
                <i className='fa fa-plus-circle me-2' ></i>
                Agregar</Link>
              <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
                <i class="fa-solid fa-circle-arrow-left me-2" ></i>
                Regresar</Link>
            </div>
          </div>
        
       
          <ToastContainer /> 
        </div>
      </section>
      <section className='cuenta-list'>
        <div className='container'>
          <div className='row'>
            {cuentas.map((cuentas) => (
              <div key={cuentas.id} className='col-md-6'>
                <div className='card'>
                  <div className='card-body'>
                    <div className='row align-items-center d-flex jutify-content-around'>
                      <div className='col-md-4'>
                        <img src='https://creazilla-store.fra1.digitaloceanspaces.com/emojis/42134/bank-emoji-clipart-md.png' alt='' className='cuenta-image'></img>
                      </div>
                      <div className='col-md-7'>
                        <ul className='list-group'>
                          <li className='list-group-item list-group-item-action'>
                            <b>Institucion financiera:</b> <span>{cuentas.institucion}</span>
                          </li>

                          <li className='list-group-item list-group-item-action'>
                           <b> Descripcion:</b> <span>{cuentas.tipoCuenta}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Saldo Actual:</b> <span>${cuentas.saldoA}</span>
                          </li>
                        </ul>
                      </div>
                      <div className='col-md-1 d-flex flex-column align-items-center'>
                        {/* editar */}
                        <button
                          onClick={() => handleEditar(cuentas)}
                          className='btn btn-primary my-1'
                        >
                          <i className='fa fa-pen'></i>
                        </button>
                        {/* eliminar */}
                        <button
                          onClick={() => handleEliminar(cuentas.id)}
                          className='btn btn-danger my-1'
                        >
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
        <ModalHeader toggle={toggleModal}  style={{textAlign:'center'}}>Editar Cuenta</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='institucion' className='form-label'>
                Institución Financiera:
              </label>
              <input
                type='text'
                className='form-control'
                id='institucion'
                name='institucion'
                value={cuentaSeleccionada ? cuentaSeleccionada.institucion : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='institucion' className='form-label'>
              Descripcion:
              </label>
              <input
                type='text'
                className='form-control'
                id='tipoCuenta'
                name='tipoCuenta'
                value={cuentaSeleccionada ? cuentaSeleccionada.tipoCuenta : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='institucion' className='form-label'>
              Saldo Actual:
              </label>
              <input
                type='text'
                className='form-control'
                id='saldoA'
                name='saldoA'
                value={cuentaSeleccionada ? cuentaSeleccionada.saldoA : ''}
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

export default Cuenta