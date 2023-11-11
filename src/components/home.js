import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from '../Api/firebaseConfig';
import {Link, useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { React} from 'react';
import {useEffect, useState} from 'react'


export * from './login/login'
export * from './login/singUp'

export  function Home (){

  const [notificationShown, setNotificationShown] = useState(false);
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
      return () => {
        // Asegúrate de desuscribirte cuando el componente se desmonta
        unsubscribe();
    };
}, [])




    return (
      
      <div class="container">

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
                  <h4 class="my-1 text-info">$84,245</h4>
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
                   <h4 class="my-1 text-danger">$84,245</h4>
                   <br></br>
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
                   <h4 class="my-1 text-success">$84,245</h4>
                   <br></br>
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
                   <h4 class="my-1 text-warning">$84,245</h4>
                   <br></br>
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
       <Card border="light"  >
      <Card.Header>¿Como empezar a ahorrar?</Card.Header>
      <Card.Body >
      <ListGroup as="ol" numbered>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Establece Objetivos de Ahorro:</div>
          Define metas claras para tus ahorros. Puede ser para un fondo de emergencia, un viaje, una compra importante, o cualquier otro propósito. Tener objetivos específicos te ayudará a mantenerte enfocado.
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Crea un Presupuesto:</div>
          Lleva un registro de tus ingresos y gastos. Un presupuesto te permite ver en qué estás gastando tu dinero y dónde puedes hacer ajustes para ahorrar más.
        </div>
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Reduce Gastos Innecesarios:</div>
          Revisa tus gastos mensuales y busca áreas donde puedas reducir o eliminar gastos innecesarios, como suscripciones que no utilizas o comidas fuera de casa con frecuencia.
        </div>
        
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Compra con Inteligencia:</div>
          Compara precios antes de comprar, busca descuentos y utiliza cupones siempre que sea posible. Evita las compras impulsivas y espera antes de realizar compras importantes.
        </div>        
      </ListGroup.Item>

      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">Sé Persistente y Paciente:</div>
          Ahorrar lleva tiempo, especialmente si estás trabajando para alcanzar metas grandes. Sé constante y paciente, y no te desanimes si no ves resultados inmediatos.
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

