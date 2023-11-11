import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Emojipicker from 'emoji-picker-react'; // Librería para seleccionar emoji
import {db} from '../Api/firebaseConfig'; // Reemplaza 'InsertarCategoria' con la función adecuada para guardar datos en tu base de datos

function RegistrarCategoria() {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [icono, setIcono] = useState(''); // Puedes almacenar el emoji seleccionado aquí
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
  const navigate = useNavigate();

  const seleccionarEmoji = (emojiObject) => {
    setIcono(emojiObject.emoji);
    setMostrarEmojiPicker(false);
  };

  const handleGuardarCategoria = () => {
    // Aquí puedes guardar los datos en la base de datos
    const nuevaCategoria = {
      nombre: nombreCategoria,
      icono: icono,
    };

     // Guardar los datos en la base de datos de Firebase
     db.collection('categorias')
     .add(nuevaCategoria)
     .then((docRef) => {
       console.log('Categoría guardada con ID: ', docRef.id);
       // Realizar cualquier acción adicional después de guardar los datos, como redirigir al usuario.

       // Redirigir al usuario a la página de inicio u a otra página después de guardar los datos
       navigate('/CategoriasTabla');
        // Redirige al usuario a la vista de IngresosTabla con los datos de categoría
       navigate(`/IngresosTabla?nombreCategoria=${nombreCategoria}&icono=${icono}`);
     })
     .catch((error) => {
       console.error('Error al guardar la categoría: ', error);
     });
 };

  return (

    <section>
    <div className="container">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-8 col-xl-6">
        <div class="row">
        <div class="col text-center">
              <h1>Registrar Categoría</h1>
            </div>
          </div>
        
        <div className='row align-items-center'>
        <div className="col mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la categoria"
            id="nombreCategoria"
            value={nombreCategoria}
            onChange={(e) => setNombreCategoria(e.target.value)}
          />
        </div>
        </div>

      <div className='row align-items-center mt-4'>
        <div className="col mt-4">
          <button
            className="btn btn-light"
            onClick={() => setMostrarEmojiPicker(true)}
          >

            Seleccionar Icono
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
      
    </div>
    </section>
  );
}

export default RegistrarCategoria;
