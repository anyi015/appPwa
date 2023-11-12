import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../Api/firebaseConfig';
import {Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { React} from 'react';
import {useEffect, useState} from 'react'
import { FaBullseye, FaMoneyBill, FaShoppingCart, FaChartLine, FaClock } from 'react-icons/fa'; // Importa los íconos que necesitas
import { db } from '../Api/firebaseConfig';
export * from './login/login'
export * from './login/singUp'

export  function Home (){

  const [notificationShown, setNotificationShown] = useState(false);
  const [ultimoSaldo, setUltimoSaldo] = useState(null);
  const [ultimoIngreso, setUltimoIngreso] = useState(null);
  const [ultimoGasto, setUltimoGasto] = useState(null);
  const [ultimoObjetivo, setUltimoObjetivo] = useState(null);
  const notify = () => {
    toast.success("Bienvenido!",{
      icon: '👋'
    })
};
  

  useEffect(()=>{


   const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          console.log("uid", uid)
          
          // Comprueba si ya se ha mostrado la notificación
          if (!notificationShown) {
            notify();
            setNotificationShown(true);  // Establece el estado para indicar que la notificación ya se ha mostrado
        }
          
        } else {
          console.log("el usuario esta ingresado")
          
        }
      });

      const unsubscribeSaldo = db.collection('cuentas')
      .orderBy('id', 'desc') // Ajusta el campo de fecha según tu estructura
      .limit(1) // Limita a 1 para obtener solo el último dato
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          // Si hay datos en la colección que cumplen con la condición
          const ultimoSaldo = snapshot.docs[0].data().saldoA;
          setUltimoSaldo(ultimoSaldo);
        } else {
          // Si no hay datos que cumplan con la condición
          setUltimoSaldo(null);
        }
      });

      const unsubscribeIngresos = db.collection('Ingresos')
      .orderBy('id', 'desc') // Ajusta el campo de fecha según tu estructura
      .limit(1) // Limita a 1 para obtener solo el último dato
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          // Si hay datos en la colección que cumplen con la condición
          const ultimoIngreso = snapshot.docs[0].data().valor;
          setUltimoIngreso(ultimoIngreso);
        } else {
          // Si no hay datos que cumplan con la condición
          setUltimoIngreso(null);
        }
      });

      const unsubscribeGastos = db.collection('Gastos')
      .orderBy('fechaGasto', 'desc') // Ajusta el campo de fecha según tu estructura
      .limit(1) // Limita a 1 para obtener solo el último dato
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          // Si hay datos en la colección que cumplen con la condición
          const ultimoGasto = snapshot.docs[0].data().valorGasto;
          setUltimoGasto(ultimoGasto);
        } else {
          // Si no hay datos que cumplan con la condición
          setUltimoGasto(null);
        }
      });

      const unsubscribeObjetivos = db.collection('Objetivos')
      .orderBy('id', 'desc') // Ajusta el campo de fecha según tu estructura
      .limit(1) // Limita a 1 para obtener solo el último dato
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          // Si hay datos en la colección que cumplen con la condición
          const ultimoObjetivo = snapshot.docs[0].data().valorObjetivo;
          setUltimoObjetivo(ultimoObjetivo);
        } else {
          // Si no hay datos que cumplan con la condición
          setUltimoObjetivo(null);
        }
      });


      return () => {
        // Asegúrate de desuscribirte cuando el componente se desmonta
        unsubscribe();
        unsubscribeSaldo();
        unsubscribeIngresos();
        unsubscribeGastos();
        unsubscribeObjetivos();
    };
}, [])




    return (
      
      <div class="container">


<div className='grid'>
          <div>
            <h4 style={{ textAlign: 'center', fontWeight:'500', fontSize:'x-large'}}>Descubre una forma más efectiva de gestionar tus finanzas personales:</h4>
           <br></br>
            <p className="text-h3 text-center " style={{  fontWeight:'200' }}>
   Registra tus gastos e ingresos, organiza tus cuentas según tus necesidades, establece objetivos de ahorro y accede a informes detallados, todo desde un solo lugar.
</p>
           
            <br></br>
          </div>
        </div>
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4">
             <div class="col">
           <div class="card radius-10 border-start border-0 border-3 border-info">
            <div class="card-body">
              <div>
                <Link to='/Cuenta'>
                <div class="d-flex align-items-center" >
                <div>
                  <p class="mb-0 text-secondary">Saldo actual:</p>
                  <br></br>
                  <h4 class="my-1 text-info">{ultimoSaldo ? `$${ultimoSaldo}` : 'No hay datos'}</h4>
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
                   <p class="mb-0 text-secondary">Ingresos:</p>
                   <br></br>
                   <h4 class="my-1 text-danger">{ultimoIngreso ? `${ultimoIngreso}` : 'No hay datos'}</h4>
                  
                 </div>
                 <div class="widgets-icons-2 rounded-circle bg-gradient-bloody text-white ms-auto"><i class="fa-solid fa-money-bill-trend-up"></i>
                 </div>
               </div>
               </Link>
               </div>

             </div>
          </div>
          </div>
          <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-success">
             <div class="card-body">
              <div>
                <Link to='/Gastos'>
               <div class="d-flex align-items-center">
                 <div>
                   <p class="mb-0 text-secondary">Gastos:</p>
                   <br></br>
                   <h4 class="my-1 text-success">{ultimoGasto ? `${ultimoGasto}` : 'No hay datos'}</h4>
                   
                 </div>
                 <div class="widgets-icons-2 rounded-circle bg-gradient-ohhappiness text-white ms-auto"><i class="fa-solid fa-file-invoice-dollar"></i>
                 </div>
               </div>
               </Link>
               </div>

             </div>
          </div>
          </div>
          <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-warning">
             <div class="card-body">
              <div>
                <Link to='/Objetivos'>
               <div class="d-flex align-items-center">
                 <div>
                   <p class="mb-0 text-secondary">Objetivo:</p>
                   <br></br>
                   <h4 class="my-1 text-warning">{ultimoObjetivo ? `${ultimoObjetivo}` : 'No hay datos'}</h4>
                  
                 </div>
                 <div class="widgets-icons-2 rounded-circle bg-gradient-blooker text-white ms-auto"><i class="fa-solid fa-arrow-trend-up"></i>
                 </div>
               </div>
               </Link>
               </div>
               
             </div>
          </div>
          </div> 
        </div>


       <div>
       <Card border="light">
      <Card.Header style={{ backgroundColor: '#cfc6e3', color: 'white' }}>
        <h3 className="text-center mb-0">¿Cómo empezar a ahorrar?</h3>
      </Card.Header>
      <Card.Body>
        <ListGroup as="ol" numbered>
          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                <FaBullseye className="me-2" />
                Establece Objetivos de Ahorro:
              </div>
              <p>
                Define metas claras para tus ahorros. Puede ser para un fondo de emergencia, un viaje, una compra importante, o cualquier otro propósito. Tener objetivos específicos te ayudará a mantenerte enfocado.
              </p>
            </div>
          </ListGroup.Item>

          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                <FaMoneyBill className="me-2" />
                Crea un Presupuesto:
              </div>
              <p>
                Lleva un registro de tus ingresos y gastos. Un presupuesto te permite ver en qué estás gastando tu dinero y dónde puedes hacer ajustes para ahorrar más.
              </p>
            </div>
          </ListGroup.Item>

          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                <FaShoppingCart className="me-2" />
                Reduce Gastos Innecesarios:
              </div>
              <p>
                Revisa tus gastos mensuales y busca áreas donde puedas reducir o eliminar gastos innecesarios, como suscripciones que no utilizas o comidas fuera de casa con frecuencia.
              </p>
            </div>
          </ListGroup.Item>

          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                
                <FaChartLine className="me-2" />
                Compra con Inteligencia:
              </div>
              <p>
                Compara precios antes de comprar, busca descuentos y utiliza cupones siempre que sea posible. Evita las compras impulsivas y espera antes de realizar compras importantes.
              </p>
            </div>
          </ListGroup.Item>

          <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                <FaClock className="me-2" />
                Sé Persistente y Paciente:
              </div>
              <p>
                Ahorrar lleva tiempo, especialmente si estás trabajando para alcanzar metas grandes. Sé constante y paciente, y no te desanimes si no ves resultados inmediatos.
              </p>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
        </div> 

    <ToastContainer icon={false} />
      </div>

      
        
    );

  }
  
export default Home

