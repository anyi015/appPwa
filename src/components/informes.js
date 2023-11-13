import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth} from '../Api/firebaseConfig';
import Gastos from './Gastos';

export function Informes() {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const userId = auth.currentUser ? auth.currentUser.uid : null; 

  useEffect(() => {
   
    const unsubscribeGastos = db.collection('usuarios').doc(userId).collection('gastos').onSnapshot((snapshot) => {
      const nuevosGastos = snapshot.docs.map((doc) => ({
        id: doc.id,
        saldoA: doc.data().saldoA,
        valor: doc.data().valor,
        valorGasto: doc.data().valorGasto,
        valorObjetivo: doc.data().valorObjetivo,
      }));
      setGastos(nuevosGastos);
    });
    const unsubscribeIngresos = db.collection('usuarios').doc(userId).collection('ingresos').onSnapshot((snapshot) => {
      const nuevosIngresos = snapshot.docs.map((doc) => ({
        id: doc.id,
        saldoA: doc.data().saldoA,
        valor: doc.data().valor,
        valorGasto: doc.data().valorGasto,
        valorObjetivo: doc.data().valorObjetivo,
      }));
      setIngresos(nuevosIngresos);
    });

    return () => {
      unsubscribeGastos();
      unsubscribeIngresos();
    };
  }, []);

  useEffect(() => {
    // Calcular la suma de gastos
    const totalGastos = gastos.reduce((total, gasto) => total + parseFloat(gasto.valor), 0);
    setTotalGastos(totalGastos);

    // Calcular la suma de ingresos
    const totalIngresos = ingresos.reduce((total, ingreso) => total + parseFloat(ingreso.valor), 0);
    setTotalIngresos(totalIngresos);
  }, [gastos, ingresos]);


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
          <div class="container">

<div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
       <div class="col">
     <div class="card radius-10 border-start border-0 border-3 border-info">
      <div class="card-body">
        <div>
          <Link to='/Cuenta'>
          <div class="d-flex align-items-center" >
          <div>
            <p class="mb-0 text-secondary"><b>Total ingresos:</b></p>
            <br></br>
            <ul>
        {ingresos.map((ingreso) => (
          <li key={ingreso.id}>
            ${ingreso.valor}
          </li>
        ))}
      </ul>
          </div>
          <div class="widgets-icons-2 rounded-circle bg-gradient-scooter text-white ms-auto"><i class="fa fa-dollar"></i>
          </div>
        </div>
          </Link>
        </div>
        
      </div>
     </div>
     </div>
     <div class="col">

    <div class="card radius-10 border-start border-0 border-3 border-danger">
       <div class="card-body">
        <div>
          <Link to='/Ingresos'>
         <div class="d-flex align-items-center">
           <div>
             <p class="mb-0 text-secondary"><b>Total Gastos:</b></p>
             <br></br>
             <ul>
        {gastos.map((gasto) => (
          <li key={gasto.id}>
            ${gasto.valorGasto}
          </li>
        ))}
      </ul>
            
           </div>
           <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa-solid fa-money-bill-trend-up"></i>
           </div>
         </div>
         </Link>
         </div>

       </div>
    </div>
    </div>
    </div>
    </div>
    </div>



    </section>

    


    
  );
}

export default Informes;
