import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../Api/firebaseConfig';

function CategoriasTabla() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Obtener datos de categorías desde la base de datos
    const unsubscribe = db.collection('categorias').onSnapshot((snapshot) => {
      const categoriasData = [];
      snapshot.forEach((doc) => {
        categoriasData.push({ id: doc.id, ...doc.data() });
      });
      setCategorias(categoriasData);
    });

    return () => unsubscribe();
  }, []);

  const handleEliminarCategoria = (id) => {
    // Eliminar una categoría por su ID
    db.collection('categorias')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Categoría eliminada con éxito');
      })
      .catch((error) => {
        console.error('Error al eliminar la categoría: ', error);
      });
  };

  return (
    <div className="container">
      <h1 style={{textAlign:'center'}}>Categorías</h1>
      <br></br>
      <Link to='/RegistrarCategoria' className='btn btn-success btn-lg ms-2'>
          <i className='fa fa-plus-circle me-2' ></i>
          Agregar</Link>
      <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple'}}>
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
                <Link to={`/EditarCategoria/${categoria.id}`} className="btn btn-primary my-1 ms-2">
                <i className='fa fa-pen'></i>
                </Link>
                <button
                  onClick={() => handleEliminarCategoria(categoria.id)}
                  className="btn btn-danger my-1 ms-2"
                >
                  <i className='fa fa-trash'></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CategoriasTabla;
