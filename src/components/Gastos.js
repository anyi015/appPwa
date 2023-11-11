import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../Api/firebaseConfig';

export function Gastos() {

  const navigate = useNavigate();
  const [gastos, setGastos] = useState([]);
  const [imagenVisible, setImagenVisible] = useState(false);
  const [imagenGastoSeleccionado, setImagenGastoSeleccionado] = useState(null);

  useEffect(() => {
    const unsubscribe = db.collection('Gastos').onSnapshot((snapshot) => {
      const nuevosGastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGastos(nuevosGastos);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEliminarGasto = (gastoId) => {
    db.collection('Gastos')
      .doc(gastoId)
      .delete()
      .then(() => {
        console.log('Gasto eliminado con éxito.');
      })
      .catch((error) => {
        console.error('Error al eliminar el gasto: ', error);
      });
  };

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
      <div class="container">
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
      </div>

      <div class="container mt-4">
        <table className="table table-hover mt-3">
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
                  >
                    <i className='fa fa-pen'></i>
                  </button>
                  <button
                    onClick={() => handleEliminarGasto(gasto.id)}
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


    </section>
  )
}

export default Gastos