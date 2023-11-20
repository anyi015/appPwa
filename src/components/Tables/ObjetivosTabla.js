import React,{useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {db, auth} from '../../Api/firebaseConfig';



export function ObjetivosTabla() {
  const navigate = useNavigate(); // Obtiene la instancia de useHistory
  const [objetivo, setObjetivo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [valorObjetivo, setvalorObjetivo] = useState('');
  const [cuentas, setCuentas] = useState([]);
  const [cuentaInstitucion, setCuentaInstitucion] = useState('');

  const handleGuardarObjetivo = () => {
    // Crear un objeto con los datos a guardar
    const nuevoObjetivo = {
      objetivo: objetivo,
      fechaFinal: fechaFinal,
      fechaInicio: fechaInicio,
      valorObjetivo: valorObjetivo,
      descripcion: descripcion,
    };
    

    // Guardar los datos en la subcolección de objetivos del usuario actual
    db.collection('usuarios')
      .doc(auth.currentUser.uid)
      .collection('objetivos')
      .add(nuevoObjetivo)
      .then((docRef) => {
        console.log('Objetivo guardado con ID: ', docRef.id);
        navigate('/Objetivos');
      })
      .catch((error) => {
        console.error('Error al guardar el objetivo: ', error);
      });
  };
  
  
  useEffect(() => {
    const user = auth.currentUser;

    const userId = user.uid
    // Obtener datos de Firebase para Cuentas
    const unsubscribeCuentas = db.collection('usuarios').doc(userId).collection('cuentas').onSnapshot((snapshot) => {
        const nuevasCuentas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCuentas(nuevasCuentas);
      });

    // Limpia las suscripciones cuando la vista se desmonta
    return () => {
        unsubscribeCuentas();
    };
}, []);


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
                                <label htmlFor='gasto' className='form-label'>
                                    Nombre de la cuenta:
                                </label>
                                <select
                                    className="form-control"
                                    value={cuentaInstitucion}
                                    onChange={(e) => setCuentaInstitucion(e.target.value)}
                                >
                                    <option value="">Selecciona una cuenta</option>
                                    {cuentas.map((cuenta) => (
                                        <option key={cuenta.id} value={cuenta.institucion}>
                                            {cuenta.institucion}
                                        </option>
                                    ))}
                                </select>
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