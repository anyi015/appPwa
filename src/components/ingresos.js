import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../Api/firebaseConfig';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function Ingresos() {

  const [ingresos, setIngresos] = useState([]);
  const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
  const [cuentaInstitucion, setCuentaInstitucion] = useState('');
  const [modal, setModal] = useState(false);
  const [cuentas, setCuentas] = useState([]);

  //notificaciones 
  const notify = () => {
    toast.success("Editado con exito!")
  };
  const notifyDelete = () => {
    toast.error("Eliminado con exito!")
  };


  // Obtener datos de Firebase para Ingresos y cuentas
  useEffect(() => {

    const unsubscribe = db.collection('usuarios').doc(auth.currentUser.uid).collection('ingresos').onSnapshot((snapshot) => {
      const nuevosIngresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIngresos(nuevosIngresos);
    });

    const unsubscribeCuentas = db.collection('usuarios').doc(auth.currentUser.uid).collection('cuentas').onSnapshot((snapshot) => {
      const nuevaCuenta = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        nuevaCuenta.push({ id: doc.id, ...data });
      });
      setCuentas(nuevaCuenta);
    });
    // Limpia la suscripción cuando la vista se desmonta
    return () => {
      unsubscribe();
      unsubscribeCuentas();
    };
  }, []);


  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (ingresos) => {
    setIngresoSeleccionado(ingresos);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setIngresoSeleccionado(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    try {
      // Eliminar el ingreso de Firebase
      await db.collection('usuarios').doc(auth.currentUser.uid).collection('ingresos').doc(id).delete();
      console.log('Ingreso eliminado exitosamente');
      notifyDelete(); // Llamada a la función notify después de la actualización exitosa
    } catch (error) {
      console.error('Error al eliminar el ingreso', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await db.collection('usuarios').doc(auth.currentUser.uid).collection('ingresos').doc(ingresoSeleccionado.id).update(ingresoSeleccionado);
      console.log('Ingreso actualizado exitosamente');
      notify(); // Llamada a la función notify después de la actualización exitosa
      setIngresoSeleccionado(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar el ingreso', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngresoSeleccionado((prevIngreso) => ({ ...prevIngreso, [name]: value }));
  };


  return (

    <section>
      <div className="container">
        <div className='grid'>
          <div>
            <h1 style={{ textAlign: 'center' }}>Ingresos</h1>
            <p class="text-h3 text-center">Agrega un nuevo ingreso nueva para administrar mejor tu dinero! </p>
            <br></br>
            <Link to='/IngresosTabla' className='btn btn-success btn-lg ms-2'>
              <i className='fa fa-plus-circle me-2' ></i>
              Agregar</Link>
            <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
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
                        onClick={() => handleEditar(ingreso)}
                      >
                        <i className='fa fa-pen'></i>
                      </button>
                      <button
                        className="btn btn-danger my-1 ms-2"
                        onClick={() => handleEliminar(ingreso.id)}
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

      {/* Modal de Edición */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>Editar ingreso</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='ingreso' className='form-label'>
                Nombre del ingreso:
              </label>
              <input
                type='text'
                className='form-control'
                id='ingreso'
                name='ingreso'
                value={ingresoSeleccionado ? ingresoSeleccionado.ingreso : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='ingreso' className='form-label'>
                Nombre de la cuenta:
              </label>
              <select
                className="form-control"
                value={ingresoSeleccionado ? ingresoSeleccionado.cuentaInstitucion : ''}
                onChange={handleChange}
                id='cuentaInstitucion'
                name='cuentaInstitucion'
              >
                <option value="">Selecciona una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.institucion}>
                    {cuenta.institucion}
                  </option>
                ))}
              </select>
              <br></br>

              <label htmlFor='institucion' className='form-label'>
                Fecha:
              </label>
              <input
                type='date'
                className='form-control'
                id='fecha'
                name='fecha'
                value={ingresoSeleccionado ? ingresoSeleccionado.fecha : ''}
                onChange={handleChange}

              />
            </div>

            <label htmlFor='institucion' className='form-label'>
              Valor:
            </label>
            <input
              type='text'
              className='form-control'
              id='valor'
              name='valor'
              value={ingresoSeleccionado ? ingresoSeleccionado.valor : ''}
              onChange={handleChange}

            />

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


    </section>


  )
}

export default Ingresos