import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Emojipicker from 'emoji-picker-react'; // Librería para seleccionar emoji
import {db, auth} from '../Api/firebaseConfig'; // Reemplaza 'InsertarCategoria' con la función adecuada para guardar datos en tu base de datos
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrarCategoria() {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [icono, setIcono] = useState(''); // Puedes almacenar el emoji seleccionado aquí
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
  const navigate = useNavigate();

  const seleccionarEmoji = (emojiObject) => {
    setIcono(emojiObject.emoji);
    setMostrarEmojiPicker(false);
  };
  // Obtener el ID del usuario actual
  const userId = auth.currentUser.uid;

  const handleGuardarCategoria = async () => {
    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const categoriasSnapshot = await db
        .collection('usuarios')
        .doc(userId)
        .collection('categorias')
        .where('nombre', '==', nombreCategoria)
        .get();

      if (!categoriasSnapshot.empty) {
        // Mostrar notificación de que la categoría ya existe
        toast.error(`La categoría "${nombreCategoria}" ya existe. Cambia el nombre.`);
        return;
      }

      // Guardar los datos en la base de datos de Firebase
      const nuevaCategoria = {
        nombre: nombreCategoria,
        icono: icono,
      };

      const docRef = await db
        .collection('usuarios')
        .doc(userId)
        .collection('categorias')
        .add(nuevaCategoria);

      console.log('Categoría guardada con ID: ', docRef.id);
      toast.success('Categoría guardada con éxito');
      navigate('/CategoriasTabla');
    } catch (error) {
      console.error('Error al guardar la categoría: ', error);
      toast.error('Error al guardar la categoría');
    }
  };

  return (

    <section>
    <div className="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-8 col-xl-6">
        <div class="row">
        <div class="col text-center">
              <h1>Registrar Categoría:</h1>
            </div>
          </div>
        
        <div className='row align-items-center'>
        <div className="col mt-4">
        <label htmlFor='categoria' className='form-label'>
        Nombre de la categoria
              </label>
          <input
            type="text"
            className="form-control"
            placeholder="ej. Ropa"
            id="nombreCategoria"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
          />
        </div>
        </div>

      <div className='row align-items-center mt-4'>
        <div className="col mt-4">
        <label htmlFor='categoria' className='form-label'>
        Selecciona un icono:
              </label>
              <br></br>
          <button
            className="btn btn-light large-icon"
            onClick={() => setMostrarEmojiPicker(true)}
          >

          🎁
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
        </div>

        <div className="align-items-center d-flex flex-column">
          <button
            className="btn btn-success mt-4"
            onClick={handleGuardarCategoria}
          >
            Guardar
          </button>
          <br></br>
          <Link to="/CategoriasTabla" className='btn btn-light' style={{ color: 'white', background: 'purple'}}>
            Cancelar
          </Link>
        </div>
      </div>

      </div>
      <ToastContainer />
      
    </div>
    </section>
  );
}

export default RegistrarCategoria;
