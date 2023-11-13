import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { db, storage, auth } from '../Api/firebaseConfig';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Gastos() {

  const [gastos, setGastos] = useState([]);
  const [imagenVisible, setImagenVisible] = useState(false);
  const [imagenGastoSeleccionado, setImagenGastoSeleccionado] = useState(null);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
  const [cuentas, setCuentas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(false);
  const fileInputRef = useRef(null);


// Obtener el usuario actual
const user = auth.currentUser
  const userId = user ? user.uid : null;
  //notificaciones 
  const notify = () => {
    toast.success("Editado con exito!")
  };
  const notifyDelete = () => {
    toast.error("Eliminado con exito!")
  };

  // Obtener datos de Firebase para Gastos,cuentas y categorias
  useEffect(() => {
    if (userId) {
    const unsubscribe = db.collection('usuarios').doc(userId).collection('gastos').onSnapshot((snapshot) => {
      const nuevosGastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGastos(nuevosGastos);
    });

    const unsubscribeCuentas = db.collection('usuarios').doc(userId).collection('cuentas').onSnapshot((snapshot) => {
      const nuevasCuentas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCuentas(nuevasCuentas);
    });

    const unsubscribeCategorias = db.collection('usuarios').doc(userId).collection('categorias').onSnapshot((snapshot) => {
      const nuevaCategorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategorias(nuevaCategorias);
    });

    return () => {
      unsubscribe();
      unsubscribeCuentas();
      unsubscribeCategorias();
    };
    }
  }, [userId]);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (gastos) => {
    setGastoSeleccionado(gastos);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setGastoSeleccionado(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    try {
      // Eliminar el gasto de Firebase
      await db.collection('usuarios').doc(userId).collection('gastos').doc(id).delete();
      console.log('Gasto eliminado exitosamente');
      notifyDelete(); // Llamada a la función notify después de la eliminación exitosa
    } catch (error) {
      console.error('Error al eliminar el gasto', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      // Realizar la actualización del documento en Firestore con la URL de la imagen
      await db.collection('usuarios').doc(userId).collection('gastos').doc(gastoSeleccionado.id).update({
        imagenUrl: gastoSeleccionado.imagenUrl,
        gasto: gastoSeleccionado.gasto,
        nombreCategoria: gastoSeleccionado.nombreCategoria,
        cuentaInstitucion: gastoSeleccionado.cuentaInstitucion,
        fechaGasto: gastoSeleccionado.fechaGasto,
        valorGasto: gastoSeleccionado.valorGasto
       
      });

      console.log('Gasto actualizado exitosamente');
      notify(); // Notificación de actualización exitosa
      setGastoSeleccionado(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'imagenUrl' && files && files[0]) {
      // Si el campo es imagenUrl y hay un archivo seleccionado, subir la imagen a Firebase Storage
      const file = files[0];
      const storageRef = storage.ref().child(`usuarios/${userId}/imagenesGastos/${file.name}`);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Manejar el progreso de la carga si es necesario
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        },
        async () => {
          // La carga se completó, obtén la URL de la imagen y actualiza el estado
          const downloadURL = await storageRef.getDownloadURL();
          setGastoSeleccionado((prevGasto) => ({ ...prevGasto, imagenUrl: downloadURL }));
        }
      );
    } else {
      // Si no es el campo imagenUrl, actualizar el estado normalmente
      setGastoSeleccionado((prevGasto) => ({ ...prevGasto, [name]: value }));
    }
  };


  //mostrar y ocultar imagen
  const handleMostrarImagen = (imagenUrl) => {
    setImagenGastoSeleccionado(imagenUrl);
    setImagenVisible(true);
  };

  const handleOcultarImagen = () => {
    setImagenGastoSeleccionado(null);
    setImagenVisible(false);
  };

  return (
    <section>
      <div className="container">
        <div className='grid'>
          <div>
            <h1 style={{ textAlign: 'center' }}>Gastos</h1>
            <p class="text-h3 text-center">Agrega un nuevo gasto nueva para administrar mejor tu dinero! </p>
            <br></br>
            <Link to='/GastosTabla' className='btn btn-success btn-lg ms-2'>
              <i className='fa fa-plus-circle me-2' ></i>
              Agregar</Link>
            <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
              <i class="fa-solid fa-circle-arrow-left me-2" ></i>
              Regresar</Link>
          </div>
        </div>

      <div className='row align-items-left mt-4'>
        <div className="col">
        <table className="table table-hover">
          <thead>
            <tr class="table-success">
              <th>Fecha</th>
              <th>Gasto</th>
              <th>Categoría</th>
              <th>Cuenta Institución</th>
              <th>Valor</th>
              <th></th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td>{gasto.fechaGasto}</td>
                <td>{gasto.gasto}</td>
                <td>{gasto.nombreCategoria}</td>
                <td>{gasto.cuentaInstitucion}</td>
                <td>{gasto.valorGasto}</td>

                <td></td>
                <td className='align-items-center'>
                  <button
                    className="btn btn-dark my-1 ms-2"
                    onClick={() => handleMostrarImagen(gasto.imagenUrl)}
                  >
                    <i class="fa-solid fa-image"></i>
                  </button>

                  <button
                    className="btn btn-primary my-1 ms-2"
                    onClick={() => handleEditar(gasto)}
                  >
                    <i className='fa fa-pen'></i>
                  </button>
                  <button
                    onClick={() => handleEliminar(gasto.id)}
                    className="btn btn-danger my-1 ms-2"
                  >
                    <i className='fa fa-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {imagenVisible && (
          <div>
            <img
              src={imagenGastoSeleccionado}
              alt="Imagen del gasto"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <br></br>
            <button className="btn btn-success my-1 ms-2" onClick={handleOcultarImagen}>Cerrar Imagen</button>
          </div>
        )} 
      </div>
      </div>
      </div>

 {/* Modal de Edición */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>Editar ingreso</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='gasto' className='form-label'>
                Nombre del gasto:
              </label>
              <input
                type='text'
                className='form-control'
                id='gasto'
                name='gasto'
                value={gastoSeleccionado ? gastoSeleccionado.gasto : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='gasto' className='form-label'>
                Nombre de la categoria:
              </label>
              <select
                className="form-control"
                value={gastoSeleccionado ? gastoSeleccionado.nombreCategoria : ''}
                onChange={handleChange}
                id='nombreCategoria'
                name='nombreCategoria'
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <br></br>

              <label htmlFor='gasto' className='form-label'>
                Nombre de la cuenta:
              </label>
              <select
                className="form-control"
                d='cuentaInstitucion'
                name='cuentaInstitucion'
                value={gastoSeleccionado ? gastoSeleccionado.cuentaInstitucion : ''}
                onChange={handleChange}
              >
                <option value="">Selecciona una cuenta</option>
                {cuentas.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.institucion}>
                    {cuenta.institucion}
                  </option>
                ))}
              </select>
            </div>

            <label htmlFor='gasto' className='form-label'>
              Fecha:
            </label>
            <input
              type='date'
              className='form-control'
              id='fechaGasto'
              name='fechaGasto'
              value={gastoSeleccionado ? gastoSeleccionado.fechaGasto : ''}
              onChange={handleChange}

            />

            <label htmlFor='gasto' className='form-label'>
              Selecciona otra imagen:
            </label>
            <input
              type='file'
              className='form-control'
              id='imagenUrl'
              name='imagenUrl'
              ref={fileInputRef} 
              //value={gastoSeleccionado ? gastoSeleccionado.imagenUrl : ''}
              onChange={handleChange}

            />
            <label htmlFor='gasto' className='form-label'>
              Valor:
            </label>
            <input
              type='text'
              className='form-control'
              id='valorGasto'
              name='valorGasto'
              value={gastoSeleccionado ? gastoSeleccionado.valorGasto : ''}
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

export default Gastos