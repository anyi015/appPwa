import React,{useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {db} from '../../Api/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {registerServiceWorker} from '../../serviceWorkerRegistration'



export function NCuentaTabla() {
  const navigate = useNavigate(); // Obtiene la instancia de useHistory
  const [institucion, setInstitucion] = useState('');
  const [saldoA, setsaldoA] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('');

  useEffect(() => {
    registerServiceWorker(); // Registra el Service Worker al cargar el componente
  }, []);

  
  const handleGuardarCuenta = () => {
    // Crear un objeto con los datos a guardar
    const nuevaCuenta = {
      institucion: institucion,
      tipoCuenta: tipoCuenta,
      saldoA: saldoA,
    };

     // Guardar los datos en la base de datos
     db.collection('cuentas')
     .add(nuevaCuenta)
     .then((docRef) => {
       console.log('Cuenta guardada con ID: ', docRef.id);
       toast.success("Guardado con éxito!"); 

       // Envia un mensaje al Service Worker para programar la sincronización
       navigator.serviceWorker.controller.postMessage({
         type: 'SCHEDULE_SYNC',
         tag: 'guardar-cuenta',
       });

        // Redirige al usuario a la vista de cuentas
        navigate('/cuenta');
      })
     .catch((error) => {
       console.error('Error al guardar la cuenta: ', error);
     });
 };


  return (
     <section>
    <div class="container">     

      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-8 col-xl-6">
          <div class="row">
            <div class="col text-center">
              <h1>Cuenta nueva</h1>
              <p class="text-h3">Agrega una cuenta nueva para administrar mejor tu dinero! </p>
            </div>
          </div>
          
        <div class="row align-items-center">
           
           <div class="col mt-4">
             <input type="text"
              class="form-control" 
              placeholder="Institucion financiera"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              />
           </div>
         </div>
         
         <div class="row align-items-center mt-4">
           <div class="col">
             <input type="text" 
             class="form-control"
              placeholder="Tipo de cuenta"
              value={tipoCuenta}
                onChange={(e) => setTipoCuenta(e.target.value)}/>
           </div>
         </div>
         <div class="row align-items-center mt-4">
           <div class="col">
             <input type="text" 
             class="form-control" 
             placeholder="Saldo Actual"
             value={saldoA}
                onChange={(e) => setsaldoA(e.target.value)} />
                
           </div>
         </div>
  

             <div className='align-items-center d-flex flex-column '>
             <button class="btn btn-success mt-4" 
             onClick={handleGuardarCuenta}>Guardar</button> <br></br>
             <Link to={'/cuenta'} className='btn btn-light' style={{ color: 'white', background: 'purple'}}>Cancelar</Link>
             </div>
         </div>
        </div>
      <ToastContainer/>
      </div>
      

  </section>

  )
}


export default NCuentaTabla