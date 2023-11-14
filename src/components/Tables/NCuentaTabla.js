import React,{useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {db, auth} from '../../Api/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function NCuentaTabla() {
  const navigate = useNavigate(); // Obtiene la instancia de useHistory
  const [institucion, setInstitucion] = useState('');
  const [saldoA, setsaldoA] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('');


  
  const handleGuardarCuenta = async () => {
    // Crear un objeto con los datos a guardar
    const nuevaCuenta = {
      institucion: institucion,
      tipoCuenta: tipoCuenta,
      saldoA: saldoA,
    };

    try {
      // Obtener la referencia al documento del usuario actual
      const userDocRef = db.collection('usuarios').doc(auth.currentUser.uid);
  
      // Guardar los datos en la subcolección de cuentas del usuario actual
      const cuentaRef = await userDocRef.collection('cuentas').add(nuevaCuenta);
  
      console.log('Cuenta guardada con ID: ', cuentaRef.id);
      toast.success("Guardado con éxito!");
  
      // Redirige al usuario a la vista de cuentas
      navigate('/cuenta');
    } catch (error) {
      console.error('Error al guardar la cuenta: ', error);
    }
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