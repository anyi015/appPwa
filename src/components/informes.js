import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, auth} from '../Api/firebaseConfig';
import Gastos from './Gastos';

export function Informes() {
  const [gastos, setGastos] = useState([]);
  
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const navigate = useNavigate();  
  

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
        // Redirige al usuario a la página de inicio de sesión si no está autenticado
        navigate('/Informes');
        return;
    }

    const userId = user.uid;
    const gastosPromise = db.collection('usuarios').doc(userId).collection('gastos').get();
    const ingresosPromise = db.collection('usuarios').doc(userId).collection('ingresos').get();
  
    Promise.all([gastosPromise, ingresosPromise])
      .then(([gastosSnapshot, ingresosSnapshot]) => {
        const nuevosGastos = gastosSnapshot.docs.map((doc) => ({
          id: doc.id,
          saldoA: doc.data().saldoA,
          institucion: doc.data().institucion,
          valor: doc.data().valor,
          valorGasto: doc.data().valorGasto,
          valorObjetivo: doc.data().valorObjetivo,
        }));
        setGastos(nuevosGastos);
  
        const nuevosIngresos = ingresosSnapshot.docs.map((doc) => ({
          id: doc.id,
          saldoA: doc.data().saldoA,
          valor: doc.data().valor,
          valorGasto: doc.data().valorGasto,
          valorObjetivo: doc.data().valorObjetivo,
        }));
        setIngresos(nuevosIngresos);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      });
  }, [navigate]);

 

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
          <div class="d-flex align-items-center" >
          <div>
                        <p className="mb-0 text-secondary"><b>Total ingresos:</b></p>
                        <br></br>
                        <ul>
      {gastos.map((gasto) => (
        <li key={gasto.id}>
          ${gasto.valorGasto}
          <hr></hr>
        </li>
      ))}
    </ul>
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
             <p class="mb-0 text-secondary"><b>Total Gastos:</b></p>
             <br></br>
             <ul>
                        {gastos.map((gasto) => (
                          <li key={gasto.id}>
                            $ {gasto.valorGasto}
                             <hr></hr>
                          </li>
                        ))}
                      </ul>
            
           </div>
           <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa-solid fa-money-bill-trend-up"></i>
           </div>
         </div>
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
