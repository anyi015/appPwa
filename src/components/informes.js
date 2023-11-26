import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth} from '../Api/firebaseConfig';
import Gastos from './Gastos';

export function Informes() {
  const [gastos, setGastos] = useState([]);
  
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const navigate = useNavigate();  
  
  const user = auth.currentUser
  const userId = user ? user.uid : null;
  
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
        // Redirige al usuario a la página de inicio de sesión si no está autenticado
        navigate('/Informes');
        return;
    }
   

    const userId = user.uid;
    const unsubscribeGastos = db
    .collection('usuarios')
    .doc(userId)
    .collection('gastos')
    .onSnapshot((snapshot) => {
      const nuevosGastos = snapshot.docs.map((doc) => ({
        id: doc.id,
        fechaGasto: doc.data().fechaGasto,
        gasto: doc.data().gasto,
        valorGasto: doc.data().valorGasto,
        cuentaInstitucion: doc.data().cuentaInstitucion,
      }));
      setGastos(nuevosGastos);
    });

    return () => {
      unsubscribeGastos();
    };
  }, [navigate]);
  useEffect(() => {
    if (userId) {
      const unsubscribeCuentas = db.collection('usuarios').doc(userId).collection('cuentas').onSnapshot((snapshot) => {
        const nuevasCuentas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCuentas(nuevasCuentas);
      });

      return () => {
        unsubscribeCuentas();
      };
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const unsubscribeIngresos = db.collection('usuarios').doc(userId).collection('ingresos').onSnapshot((snapshot) => {
        const nuevosIngresos = snapshot.docs.map((doc) => ({
          id: doc.id,
          cuentaInstitucion: doc.data().cuentaInstitucion,
          saldoA: doc.data().saldoA,
          valor: doc.data().valor,
          valorGasto: doc.data().valorGasto,
          valorObjetivo: doc.data().valorObjetivo,
        }));
        setIngresos(nuevosIngresos);
      });

      return () => {
        unsubscribeIngresos();
      };
    }
  }, [userId]);
  

  // Función para sumar los ingresos por cuenta
  const obtenerTotalIngresosPorCuenta = (cuenta) => {
    // Filtra los ingresos por la cuenta actual
    const ingresosDeCuenta = ingresos.filter(
      (ingreso) => ingreso.cuentaInstitucion === cuenta.institucion
    );

    // Suma los valores de los ingresos
    const total = ingresosDeCuenta.reduce((suma, ingreso) => suma + (ingreso.valor || 0), 0);

    return total;
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
          </div>
        </div>

{/* <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
       <div class="col">
     <div class="card radius-10 border-start border-0 border-3 border-info">
      <div class="card-body">
        <div>
          <div class="d-flex align-items-center" >
          <div>
          <p className="mb-0 text-secondary">
                    <b>Total ingresos por cuenta:</b>
                  </p>
                  <br />
                  {cuentas.map((cuenta) => (
                    <div key={cuenta.id}>
                      <p className="mb-0">
                        <b>
                        {cuenta.institucion}
                        </b>
                        </p>
                      <ul>
                        {ingresos
                          .filter((ingreso) => ingreso.cuentaInstitucion === cuenta.institucion)
                          .map((ingreso) => (
                            <li key={ingreso.id}>
                              ${ingreso.valor}
                              <hr />
                              </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
          <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-dollar"></i>
          </div>
        </div>
        
      </div>
     </div>
     </div>
     <div class="col">

    <div class="card radius-10 border-start border-0 border-3 border-danger">
       <div class="card-body">
        <div>
         <div class="d-flex align-items-center">
           <div>
             <p class="mb-0 text-secondary"><b>Total Gastos por cuenta:</b></p>
             <br></br>

             {cuentas.map((cuenta) => (
                    <div key={cuenta.id}>
                      <p className="mb-0">
                        <b>
                        {cuenta.institucion}
                        </b>
                        </p>
                      <ul>
                        {gastos
                          .filter((gasto) => gasto.cuentaInstitucion === gasto.institucion)
                          .map((gasto) => (
                            <li key={gasto.id}>
                              ${gasto.valorGasto}
                              <hr />
                              </li>
                          ))}
                      </ul>
                    </div>
                  ))}
            
           </div>
           <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa-solid fa-money-bill-trend-up"></i>
           </div>
         </div>
         </div>

       </div>
    </div>
    </div>
    </div> */}
 
 
 <div className="row align-items-left mt-4">
          <div className="col">
            <table className="table table-hover">
              <thead>
                <tr className="table-success">
                  <th>Cuenta</th>
                  <th>Total Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((cuenta) => (
                  <tr key={cuenta.id}>
                    <td>{cuenta.institucion}</td>
                    <td>${obtenerTotalIngresosPorCuenta(cuenta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row align-items-left mt-4">
          <div className="col">
            <h2>Total de Ingresos por Cuenta</h2>
            <table className="table table-hover">
              <thead>
                <tr className="table-success">
                  <th>Cuenta</th>
                  <th>Total Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {cuentas.map((cuenta) => (
                  <tr key={cuenta.id}>
                    <td>{cuenta.institucion}</td>
                    <td>${obtenerTotalIngresosPorCuenta(cuenta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row align-items-left mt-4">
          <div className="col">
            <h2>Total General</h2>
            <p>
              Total de Ingresos: ${ingresos.reduce((total, ingreso) => total + (ingreso.valor || 0), 0)}
            </p>
            <p>
              Total de Gastos: ${gastos.reduce((total, gasto) => total + (gasto.valorGasto || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </section>





    
  );
}
export default Informes;
