import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth } from '../Api/firebaseConfig';
import Gastos from './Gastos';

export function Informes() {
  const [gastos, setGastos] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false); // Nuevo estado
  
  const navigate = useNavigate();

  const user = auth.currentUser
  const userId = user ? user.uid : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          // Redirige al usuario a la página de inicio de sesión si no está autenticado
          navigate('/Informes');
          return;
        }

        const userId = user.uid;

        // Promesas para las suscripciones
        const [gastosSnapshot, cuentasSnapshot, ingresosSnapshot, objetivosSnapshot] = await Promise.all([
          db.collection('usuarios').doc(userId).collection('gastos').get(),
          db.collection('usuarios').doc(userId).collection('cuentas').get(),
          db.collection('usuarios').doc(userId).collection('ingresos').get(),
          db.collection('usuarios').doc(userId).collection('objetivos').get(),
        ]);

        // Mapeo de los datos
        const nuevosGastos = gastosSnapshot.docs.map((doc) => ({
          id: doc.id,
          saldoA: doc.data().saldoA,
          cuentaInstitucion: doc.data().cuentaInstitucion,
          valor: doc.data().valor,
          valorGasto: doc.data().valorGasto,
          valorObjetivo: doc.data().valorObjetivo,
        }));
        setGastos(nuevosGastos);

        const nuevasCuentas = cuentasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCuentas(nuevasCuentas);

        const nuevosIngresos = ingresosSnapshot.docs.map((doc) => ({
          id: doc.id,
          cuentaInstitucion: doc.data().cuentaInstitucion,
          saldoA: doc.data().saldoA,
          valor: doc.data().valor,
          valorGasto: doc.data().valorGasto,
          valorObjetivo: doc.data().valorObjetivo,
        }));
        setIngresos(nuevosIngresos);

        const nuevosObjetivos = objetivosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setObjetivos(nuevosObjetivos);


        setDatosCargados(true);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    if (!datosCargados) {
      fetchData();
    } // Llamada a la función de obtención de datos
  }, [navigate, userId,, datosCargados]);

  const handleCargarDatos = () => {
    setDatosCargados(false);
  };
  // Función para filtrar ingresos por cuenta
  const obtenerIngresosPorCuenta = (cuenta) => {
    return ingresos.filter((ingreso) => ingreso.cuentaInstitucion === cuenta.institucion);
  };

  // Función para filtrar gastos por cuenta
  const obtenerGastosPorCuenta = (cuenta) => {
    console.log('datos', gastos);
    return gastos.filter((gasto) => gasto.cuentaInstitucion === cuenta.institucion);
  };

  return (
    <section>
      <div className="container">
        <div className="grid">
          <div>
            <h1 style={{ textAlign: 'center' }}>Informes</h1>
            <Link to="/home" className="btn btn-light btn-lg ms-2" style={{ color: 'white', background: 'purple' }}>
              <i className="fa-solid fa-circle-arrow-left me-2"></i>
              Regresar
            </Link>
            <button className="btn btn-light btn-lg ms-2" onClick={handleCargarDatos}>
              Cargar Datos <i class="fa-solid fa-arrows-rotate"></i>
            </button>
          </div>
        </div>

        <div className="row align-items-left mt-4">
          <div className="col">
            <h2><b>Ingresos y Gastos por Cuenta:</b></h2>
            <br></br>
            <table className="table table-hover">
              <thead>
                <tr className="table-success">
                  <th>Cuenta</th>
                  <th>Ingreso</th>
                  <th>Gasto</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((cuenta) => (
                  <tr key={cuenta.id}>
                    <td>{cuenta.institucion}</td>
                    <td>
                      {obtenerIngresosPorCuenta(cuenta).map((ingreso) => (
                        <div key={`ingreso_${ingreso.id}`}>${ingreso.valor}</div>
                      ))}
                    </td>
                    <td>
                      {obtenerGastosPorCuenta(cuenta).map((gasto) => (
                        <div key={`gasto_${gasto.id}`}>${gasto.valorGasto}
                      
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col">
            <h2><b>Objetivos:</b></h2>
            <br></br>
            <table className="table table-hover">
              <thead>
                <tr className="table-danger">
                  <th>Nombre del Objetivo</th>
                  <th>Fecha de Inicio</th>
                  <th>Fecha de Finalización</th>
                </tr>
              </thead>
              <tbody>
                {objetivos.map((objetivo) => (
                  <tr key={objetivo.id}>
                    <td>{objetivo.objetivo}</td>
                    <td>{objetivo.fechaInicio}</td>
                    <td>{objetivo.fechaFinal}</td>
                    {/* Agrega más celdas según tus necesidades */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>




        </div>


      </div>

    </section>





  );
}
export default Informes;
