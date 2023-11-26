import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../Api/firebaseConfig';
import Emojipicker from 'emoji-picker-react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CategoriasTabla() {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modal, setModal] = useState(false);
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
  const [icono, setIcono] = useState('');
  const navigate = useNavigate();
  //notificaciones
  const notify = () => {
    toast.success("Editado con exito!")
  };
  const notifyDelete = () => {
    toast.error("Eliminado con exito!")
  };

  const seleccionarEmoji = (emojiObject) => {
    setIcono(emojiObject.emoji);
    setMostrarEmojiPicker(false);
    setCategoriaSeleccionada((prevCategoria) => ({ ...prevCategoria, icono: emojiObject.emoji }));

  };
  // Obtener datos de categorías desde la base de datos
  useEffect(() => {
       
    // Obtener datos de Firebase para Cuentas
    const unsubscribeCategorias = db.collection('usuarios').doc(auth.currentUser.uid).collection('categorias').onSnapshot((snapshot) => {
        const nuevaCategorias = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          nuevaCategorias.push({ id: doc.id, ...data });
        });
        setCategorias(nuevaCategorias);
      });

    // Limpia las suscripciones cuando la vista se desmonta
    return () => {
        unsubscribeCategorias();
    };
}, []);


  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setCategoriaSeleccionada(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    const user = auth.currentUser;
    const userId = user.uid;

    try {
      // Eliminar la categoría de Firebase
      await db.collection('usuarios').doc(userId).collection('categorias').doc(id).delete();
      console.log('Categoría eliminada exitosamente');
      notifyDelete(); // Llamada a la función notify después de la actualización exitosa
    } catch (error) {
      console.error('Error al eliminar la categoría', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await db.collection('usuarios').doc(auth.currentUser.uid).collection('categorias').doc(categoriaSeleccionada.id).update(categoriaSeleccionada);
      console.log('Categoría actualizada exitosamente');
      notify(); // Llamada a la función notify después de la actualización exitosa
      setCategoriaSeleccionada(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar la categoría', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaSeleccionada((prevcategoria) => ({ ...prevcategoria, [name]: value }));
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>Categorías</h1>
      <br></br>
      <Link to='/RegistrarCategoria' className='btn btn-success btn-lg ms-2'>
        <i className='fa fa-plus-circle me-2' ></i>
        Agregar</Link>
      <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
        <i class="fa-solid fa-circle-arrow-left me-2" ></i>
        Regresar</Link>
      <table className="table table-hover mt-3">
        <thead>
          <tr class="table-success">
            <th >Nombre de la Categoría</th>
            <th >Icono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td className="large-icon">{categoria.icono}</td>
              <td className='align-items-center'>
                {/* editar */}
                <button
                  onClick={() => handleEditar(categoria)}
                  className='btn btn-primary my-1'
                >
                  <i className='fa fa-pen'></i>
                </button>
                <button
                  onClick={() => handleEliminar(categoria.id)}
                  className="btn btn-danger my-1 ms-2"
                >
                  <i className='fa fa-trash'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Modal de Edición */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>Editar Cuenta</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='categoria' className='form-label'>
                Nombre de la categoria
              </label>
              <input
                type='text'
                className='form-control'
                id='nombre'
                name='nombre'
                value={categoriaSeleccionada ? categoriaSeleccionada.nombre : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='categoria' className='form-label'>
                Selecciona un icono:
              </label>
              <button
                className="btn btn-light large-icon"
                type='button'

                onClick={() => setMostrarEmojiPicker(true)}
              > {categoriaSeleccionada ? categoriaSeleccionada.icono : ''}
              </button>
              {mostrarEmojiPicker && (
                <Emojipicker onEmojiClick={seleccionarEmoji} />
              )}
              {icono && (
                <div className="selected-icon">
                  Icono seleccionado: {icono}
                </div>
              )}
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

    </div>


  )
}



export default CategoriasTabla;
