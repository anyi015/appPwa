import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {db} from '../../Api/firebaseConfig';



export function ObjetivosTabla() {
  const navigate = useNavigate(); // Obtiene la instancia de useHistory
  const [objetivo, setObjetivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [valorObjetivo, setvalorObjetivo] = useState('');

  const handleGuardarObjetivo = () => {
    // Crear un objeto con los datos a guardar
    const nuevoObjetivo = {
      objetivo: objetivo,
      fechaFinal: fechaFinal,
      fechaInicio:fechaInicio,
      valorObjetivo:valorObjetivo,
      descripcion:descripcion
    };
     // Guardar los datos en la base de datos
     db.collection('Objetivos')
     .add(nuevoObjetivo)
     .then((docRef) => {
       console.log('Objetivo guardada con ID: ', docRef.id);
       // Realizar cualquier acción adicional después de guardar los datos, como redirigir al usuario.
    
    
        // Redirige al usuario a la vista de cuentas
        navigate('/Objetivos');
      })
     .catch((error) => {
       console.error('Error al guardar el objetivo: ', error);
     });
 };


  return (
  



     <section>
    <div class="container">     
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-8 col-xl-6">
          <div class="row">
            <div class="col text-center">
              <h1>Nuevo Objetivo</h1>
              <p class="text-h3">Agrega un nuevo Objetivo y administra mejor tu dinero! </p>
            </div>
          </div>
          
        <div class="row align-items-center">
           
           <div class="col mt-4">
           <label htmlFor='objetivo' className='form-label'>
                Nombre del objetivo:
              </label>
             <input type="text"
              class="form-control" 
              placeholder="Objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              />
           </div>
         </div>
         
         <div class="row align-items-center mt-4">
           <div class="col">
           <label htmlFor='objetivo' className='form-label'>
                Fecha de inicio:
              </label>
             <input type="date" 
             class="form-control"
              value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}/>
           </div>
         </div>
         <div class="row align-items-center mt-4">
           <div class="col">
           <label htmlFor='objetivo' className='form-label'>
           Fecha de final:
              </label>
             <input type="date" 
             class="form-control"
              value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}/>
           </div>
         </div>

         <div class="row align-items-center mt-4">
           <div class="col">
           <label htmlFor='objetivo' className='form-label'>
           Descripcion:
              </label>
             <input type="text" 
             class="form-control" 
             placeholder="ej. Comprar una nueva impresora"
             value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}/>
           </div>
         </div>

         <div class="row align-items-center mt-4">
           <div class="col">
           <label htmlFor='objetivo' className='form-label'>
           Valor:
              </label>
            
             <input type="text" 
             class="form-control" 
             placeholder="ej. $100"
             value={valorObjetivo}
                onChange={(e) => setvalorObjetivo(e.target.value)}/>
           </div>
         </div>
  

             <div className='align-items-center d-flex flex-column '>
             <button class="btn btn-success mt-4" 
             onClick={handleGuardarObjetivo}>Guardar</button> <br></br>
             <Link to={'/Objetivos'} className='btn btn-light' style={{ color: 'white', background: 'purple'}}>Cancelar</Link>
             </div>
         </div>
        </div>
      </div>
  </section>
  )
}


export default ObjetivosTabla