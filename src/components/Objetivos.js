import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { db, auth, messaging } from '../Api/firebaseConfig';
import { initializeApp } from '../Api/firebaseConfig';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import addNotification from 'react-push-notification'
import favicon from '../assets/favicon.svg';

export function Objetivos() {

  const [objetivos, setObjetivos] = useState([]);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState(null);
  const [modal, setModal] = useState(false);

  //notificaciones
  const notify = () => {
    toast.success("Editado con exito!")
  };
  const notifyDelete = () => {
    toast.error("Eliminado con exito!")
  };
  const notifyObjetivoC = () => {
    toast.success("Completado con exito!")
  };

  useEffect(() => {
    // Obtener datos de Firebase
    const unsubscribe = db
      .collection('usuarios')
      .doc(auth.currentUser.uid)
      .collection('objetivos')
      .onSnapshot((snapshot) => {
        const nuevoObjetivo = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          nuevoObjetivo.push({ id: doc.id, ...data });
        });
        setObjetivos(nuevoObjetivo);
      });


    // Limpia la suscripción cuando la vista se desmonta
    return () => unsubscribe();
  }, []);

  // Función para marcar el objetivo como cumplido
  const handleObjetivoCumplido = (objetivoId) => {
    // Encuentra el objetivo correspondiente por su ID
    const objetivo = objetivos.find((objetivo) => objetivo.id === objetivoId);

    if (objetivo) {
      // Marca el objetivo como cumplido en el estado local
      objetivo.cumplido = true;

      // Actualiza el objetivo en la base de datos (Firestore)
      db.collection('usuarios')
        .doc(auth.currentUser.uid)
        .collection('objetivos')
        .doc(objetivoId)
        .update({ cumplido: true })
        .then(() => {
          // Éxito: El objetivo se ha marcado como cumplido en la base de datos
          notifyObjetivoC();
          console.log('Objetivo marcado como cumplido con éxito');
          // Si deseas realizar más acciones después de marcarlo como cumplido, aquí es el lugar.
        })
        .catch((error) => {
          // Error al actualizar en la base de datos
          console.error('Error al marcar el objetivo como cumplido:', error);
          // Si es necesario, maneja el error de acuerdo a tus necesidades.
        });
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditar = (objetivo) => {
    setObjetivoSeleccionado(objetivo);
    toggleModal();
  };

  const handleCancelarEdicion = () => {
    setObjetivoSeleccionado(null);
    toggleModal();
  };

  const handleEliminar = async (id) => {
    try {
      // Eliminar el objetivo de Firebase
      await db.collection('usuarios').doc(auth.currentUser.uid).collection('objetivos').doc(id).delete();
      console.log('Objetivo eliminado exitosamente');
      notifyDelete(); // Llamada a la función notifyDelete después de la eliminación exitosa
    } catch (error) {
      console.error('Error al eliminar el Objetivo', error);
    }
  };

  const handleGuardarEdicion = async () => {
    try {
      await db.collection('usuarios').doc(auth.currentUser.uid).collection('objetivos').doc(objetivoSeleccionado.id).update(objetivoSeleccionado);
      console.log('Objetivo actualizado exitosamente');
      notify(); // Llamada a la función notify después de la actualización exitosa
      setObjetivoSeleccionado(null);
      toggleModal();
    } catch (error) {
      console.error('Error al actualizar el Objetivo', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObjetivoSeleccionado((prevObjetivo) => ({ ...prevObjetivo, [name]: value }));
  };


  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // generar token
        const token = await getToken(messaging, {
          vapidKey:
            'BB3tzAZFr1G0-DWMoJiRchWdFOz3Xlh-nKcScdCv_bVthl_TKp-4BaPbdOWLMTfzsO3IocwMnqSKGC_ZNI-AfeY',
        });
        console.log('token generado:', token);
      } else if (permission === 'default') {
        alert('Permiso denegado');
      }
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const sendNotification = (objetivo) => {
    const fechaFinal = new Date(objetivo.fechaFinal);
    const dosSemanasAntes = new Date();
    dosSemanasAntes.setDate(dosSemanasAntes.getDate() + 14); // Obtener la fecha actual + 14 días

    if (fechaFinal > new Date() && fechaFinal <= dosSemanasAntes) {
      // La fecha final está a 2 semanas de distancia y aún no ha pasado
      const notificationTitle = 'Recordatorio de Objetivo';
      const notificationOptions = {
        body: `El objetivo "${objetivo.objetivo}" está a dos semanas de su fecha final. ¡No olvides trabajar en ello!`,
        icon: favicon, // Reemplaza 'ruta/a/tu/icono.png' con la ruta real de tu icono
        // color: '#fff', // Reemplaza '#3498db' con el color deseado en formato hexadecimal
        // backgroundColor: '#6078ea',
      };

      // Mostrar la notificación
      new Notification(notificationTitle, notificationOptions);
    }
  };
  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const messaging = getMessaging();
        await requestNotificationPermission();

        // Manejar las notificaciones push mientras la aplicación está abierta
        onMessage(messaging, (payload) => {
          console.log('Notificación push recibida:', payload);
          // Puedes personalizar cómo manejar las notificaciones push aquí
          // Ejemplo: mostrar una notificación nativa usando la API Notification
          const { title, body } = payload.notification;
          new Notification(title, { body });
        });
      } catch (error) {
        console.error('Error al configurar notificaciones push:', error);
      }
    };
    setupPushNotifications();
    // Enviar recordatorio cuando la aplicación se carga
    objetivos.forEach((objetivo) => {
      sendNotification(objetivo);
    });
  }, [objetivos]);



  return (



    <React.Fragment>
      <section>
        <div className='container'>
          <div className='grid'>
            <div>
              <h1 style={{ textAlign: 'center' }}>Objetivos</h1>
              <p class="text-h3 text-center">Agrega un nuevo Objetivo y administra mejor tu dinero! </p>
              <br></br>
              <Link to='/ObjetivosTabla' className='btn btn-success btn-lg ms-2'>
                <i className='fa fa-plus-circle me-2' ></i>
                Agregar</Link>
              <Link to='/home' className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}>
                <i class="fa-solid fa-circle-arrow-left me-2" ></i>
                Regresar</Link>

            </div>
          </div>
        </div>
      </section>
      <section className='gasto-list'>
        <div className='container'>
          <div className='row'>
            {objetivos.map((objetivo) => (
              <div key={objetivo.id} className='col-md-6'>
                <div className={`card ${objetivo.cumplido ? 'bg-success' : 'bg-danger'}`}>
                  <div className='card-body' style={{ backgroundColor: objetivo.cumplido ? '#9cc4e4' : '#dd5866' }}>
                    <div className='row align-items-center d-flex jutify-content-around'>
                      <div className='col-md-4'>
                        <img src='https://cdn.icon-icons.com/icons2/2508/PNG/512/business_money_earnings_target_icon_150721.png' alt='' className='cuenta-image'></img>
                      </div>
                      <div className='col-md-7'>
                        <ul className='list-group'>
                          <li className='list-group-item list-group-item-action'>
                            <b>Objetivo:</b> <span>{objetivo.objetivo}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Fecha de Inicio:</b> <span>{objetivo.fechaInicio}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Fecha Final:</b> <span>{objetivo.fechaFinal}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Descripción:</b> <span>{objetivo.descripcion}</span>
                          </li>
                          <li className='list-group-item list-group-item-action'>
                            <b>Valor:</b> <span>{objetivo.valorObjetivo}</span>
                          </li>
                        </ul>
                      </div>
                      <div className='col-md-1 d-flex flex-column align-items-center'>
                        {objetivo.cumplido ? (
                          <span className="text-white large-icon"><b>🔓</b></span>
                        ) : (
                          <button className="btn btn-success my-1"
                            onClick={() => handleObjetivoCumplido(objetivo.id)}
                            title='Objetivo Cumplido!'
                          >
                            <i className="fa fa-check"></i>
                          </button>
                        )}

                        <Link to="/cuenta"
                          className="btn btn-secondary my-1"
                          title="Ver saldo de la cuenta">
                          <i className="fa fa-eye"></i>

                        </Link>

                        {/* editar */}
                        <button
                          onClick={() => handleEditar(objetivo)}
                          className='btn btn-primary my-1'
                          title='Editar'
                        >
                          <i className='fa fa-pen'></i>
                        </button>

                        <button
                          className='btn btn-danger my-1'
                          onClick={() => handleEliminar(objetivo.id)}
                          title='Eliminar'>
                          <i className='fa fa-trash'></i>
                        </button>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Modal de Edición */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} style={{ textAlign: 'center' }}>Editar Cuenta</ModalHeader>
        <ModalBody>
          <form>
            <div className='mb-3'>
              <label htmlFor='objetivo' className='form-label'>
                Nombre del objetivo:
              </label>
              <input
                type='text'
                className='form-control'
                id='objetivo'
                name='objetivo'
                value={objetivoSeleccionado ? objetivoSeleccionado.objetivo : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='objetivo' className='form-label'>
                Fecha de inicio:
              </label>
              <input
                type='date'
                className='form-control'
                id='fechaInicio'
                name='fechaInicio'
                value={objetivoSeleccionado ? objetivoSeleccionado.fechaInicio : ''}
                onChange={handleChange}
              />
              <br></br>

              <label htmlFor='objetivo' className='form-label'>
                Fecha de final:
              </label>
              <input
                type='date'
                className='form-control'
                id='fechaFinal'
                name='fechaFinal'
                value={objetivoSeleccionado ? objetivoSeleccionado.fechaFinal : ''}
                onChange={handleChange}

              />

              <label htmlFor='objetivo' className='form-label'>
                Descripcion:
              </label>
              <input
                type='text'
                className='form-control'
                id='descripcion'
                name='descripcion'
                value={objetivoSeleccionado ? objetivoSeleccionado.descripcion : ''}
                onChange={handleChange}

              />

              <label htmlFor='objetivo' className='form-label'>
                Valor:
              </label>
              <input
                type='text'
                className='form-control'
                id='valorObjetivo'
                name='valorObjetivo'
                value={objetivoSeleccionado ? objetivoSeleccionado.valorObjetivo : ''}
                onChange={handleChange}

              />
            </div>
            {/* Agrega más campos según tus necesidades */}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'green' }}
            onClick={handleGuardarEdicion}>
            Guardar
          </Button>
          <Button
            className='btn btn-light btn-lg ms-2' style={{ color: 'white', background: 'purple' }}
            onClick={handleCancelarEdicion}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer /> {/* Agrega este componente para mostrar las notificaciones */}
    </React.Fragment>
  )
}

export default Objetivos