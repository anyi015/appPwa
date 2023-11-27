import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Api/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { React } from 'react';
import { useEffect, useState } from 'react'
import { FaBullseye, FaMoneyBill, FaShoppingCart, FaChartLine, FaClock } from 'react-icons/fa'; // Importa los íconos que necesitas
import { db } from '../Api/firebaseConfig';
import Objetivos from './Objetivos';
import { OcupoContexto } from '../DatosGlobales';
export * from './login/login'
export * from './login/singUp'

export function Home() {

  const [notificationShown, setNotificationShown] = useState(false);
  const [gastos, setGastos] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const {Mostrar_Mensaje, set_Mostrar_Mensaje} =OcupoContexto()

  const notify = () => {
    if(Mostrar_Mensaje === true){

      toast.success("Bienvenido!", {
        icon: '👋'
      })

      set_Mostrar_Mensaje(false)
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        if (!notificationShown) {
          notify();
          setNotificationShown(true);
        }
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [notificationShown]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
 
    if (user) {
      const userId = user.uid;
    const unsubscribeGastos = db.collection('usuarios').doc(userId).collection('gastos').onSnapshot((snapshot) => {
      // Seleccionar solo el primer elemento de la lista de gastos
      const primerGasto = snapshot.docs[0];

      if (primerGasto) {
        const datosGasto = {
          id: primerGasto.id,
          saldoA: primerGasto.data().saldoA,
          valor: primerGasto.data().valor,
          valorGasto: primerGasto.data().valorGasto,
          valorObjetivo: primerGasto.data().valorObjetivo,
        };

        setGastos([datosGasto]); // Mantener setGastos como un array incluso si solo hay un gasto
      } else {
        // Manejar el caso donde no hay gastos
        setGastos([]);
      }
    });

    const unsubscribeCuentas = db.collection('usuarios').doc(userId).collection('cuentas').onSnapshot((snapshot) => {
      // Seleccionar solo el primer elemento de la lista de cuentas
      const primeraCuenta = snapshot.docs[0];

      if (primeraCuenta) {
        const datosCuenta = {
          id: primeraCuenta.id,
          saldoA: primeraCuenta.data().saldoA,
          valor: primeraCuenta.data().valor,
          valorgasto: primeraCuenta.data().valorgasto,
          valorObjetivo: primeraCuenta.data().valorObjetivo,
        };

        setCuentas([datosCuenta]);
      } else {
        setCuentas([]);
      }
    });

    const unsubscribeIngresos = db.collection('usuarios').doc(userId).collection('ingresos').onSnapshot((snapshot) => {
      // Seleccionar solo el primer elemento de la lista de cuentas
      const primeraIngreso = snapshot.docs[0];

      if (primeraIngreso) {
        const datosIngreso = {
          id: primeraIngreso.id,
          saldoA: primeraIngreso.data().saldoA,
          valor: primeraIngreso.data().valor,
          valorgasto: primeraIngreso.data().valorgasto,
          valorObjetivo: primeraIngreso.data().valorObjetivo,
        };

        setIngresos([datosIngreso]);
      } else {
        setIngresos([]);
      }
    });

    const unsubscribeObjetivos = db.collection('usuarios').doc(userId).collection('objetivos').onSnapshot((snapshot) => {
      // Seleccionar solo el primer elemento de la lista de gastos
      const primerObj = snapshot.docs[0];

      if (primerObj) {
        const datosObj = {
          id: primerObj.id,
          saldoA: primerObj.data().saldoA,
          valor: primerObj.data().valor,
          valorGasto: primerObj.data().valorGasto,
          valorObjetivo: primerObj.data().valorObjetivo,
        };

        setObjetivos([datosObj]); // Mantener setGastos como un array incluso si solo hay un gasto
      } else {
        // Manejar el caso donde no hay gastos
        setObjetivos([]);
      }
    });

    return () => {
      unsubscribeGastos();
      unsubscribeCuentas();
      unsubscribeIngresos();
      unsubscribeObjetivos();
    };
  } else {
    // Manejar el caso cuando el usuario no está autenticado
    setGastos([]);
    setCuentas([]);
    setIngresos([]);
    setObjetivos([]);
  }
});

return () => unsubscribe();
}, []);

  return (

    <div class="container">
      <div className='grid'>
        <div>
          <h4 style={{ textAlign: 'center', fontWeight: '500', fontSize: 'x-large' }}>Descubre una forma más efectiva de gestionar tus finanzas personales:</h4>
          <br></br>
          <p className="text-h3 text-center " style={{ fontWeight: '200' }}>
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
                      <ul>
                        {cuentas.map((cuenta) => (
                          <li key={cuenta.id}>
                            ${cuenta.saldoA}
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
                      <p class="mb-0 text-secondary">Ingresos:</p>
                      <br></br>
                      <ul>
                        {ingresos.map((ingreso) => (
                          <li key={ingreso.id}>
                            ${ingreso.valor}
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
        <div class="col">
          <div class="card radius-10 border-start border-0 border-3 border-success">
            <div class="card-body">
              <div>
                <Link to='/Gastos'>
                  <div class="d-flex align-items-center">
                    <div>
                      <p class="mb-0 text-secondary">Gastos:</p>
                      <br></br>
                      <ul>
                        {gastos.map((gasto) => (
                          <li key={gasto.id}>
                          {gasto.valorGasto}
                          </li>
                        ))}
                      </ul>
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
                      <ul>
                        {objetivos.map((objetivo) => (
                          <li key={objetivo.id}>
                            ${objetivo.valorObjetivo}
                          </li>
                        ))}
                      </ul>
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



      <footer>© Derechos Reservados. Anyi Vianey </footer>
    </div>



  );

}

export default Home

