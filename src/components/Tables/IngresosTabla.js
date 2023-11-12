import React, { useState,useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { db } from '../../Api/firebaseConfig';

function IngresosTabla() {

    const navigate = useNavigate(); // Obtiene la instancia de useHistory
    const [ingreso, setIingreso] = useState('');
    const [cuentaInstitucion, setCuentaInstitucion] = useState('');
    const [valor, setValor] = useState('');
    const [fecha, setFecha] = useState('');
    const [cuentas, setCuentas] = useState([]);


    useEffect(() => {
       
        // Obtener datos de Firebase para Cuentas
        const unsubscribeCuentas = db.collection('cuentas').onSnapshot((snapshot) => {
            const nuevasCuentas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCuentas(nuevasCuentas);
        });

        // Limpia las suscripciones cuando la vista se desmonta
        return () => {
            unsubscribeCuentas();
        };
    }, []);


    const handleGuardarIngreso = () => {
        // Crear un objeto con los datos a guardar
        const nuevoIngreso = {
            ingreso: ingreso,
            fecha: fecha,
            valor: valor,
            cuentaInstitucion: cuentaInstitucion,

        };
        // Guardar los datos en la base de datos
        db.collection('Ingresos')
            .add(nuevoIngreso)
            .then((docRef) => {
                console.log('Ingreso guardada con ID: ', docRef.id);
                // Realizar cualquier acción adicional después de guardar los datos, como redirigir al usuario.


                // Redirige al usuario a la vista de ingresos
                navigate('/Ingresos');
            })
            .catch((error) => {
                console.error('Error al guardar el ingreso: ', error);
            });
    };


    return (
        <section>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-8 col-xl-6">
                        <div class="row">
                            <div class="col text-center">
                                <h1>Nuevo Ingreso</h1>
                                <p class="text-h3">Agrega un nuevo ingreso para administrar mejor tu dinero! </p>
                            </div>
                        </div>

                        <div class="row align-items-center">
                
                            <div class="col mt-4">
                            <label className='form-label'>
                                    Nombre del ingreso:
                                </label>
                                <input type="text"
                                    class="form-control"
                                    placeholder="ej. Ahorro"
                                    value={ingreso}
                                    onChange={(e) => setIingreso(e.target.value)}
                                />
                            </div>
                        </div>

                        <div class="row align-items-center mt-4">
                            <div class="col">
                            <label className='form-label'>
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
                                <label className='form-label'>
                                    Fecha:
                                </label>
                                <input type="date"
                                    class="form-control"
                                    placeholder="Fecha"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)} />
                            </div>
                        </div>

                        <div class="row align-items-center mt-4">
                            <div class="col">
                            <label className='form-label'>
                                    Ingresa un valor:
                                </label>
                                <input type="text"
                                    class="form-control"
                                    placeholder="$ Valor"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)} />
                                    
                            </div>
                        </div>

                        


                        <div className='align-items-center d-flex flex-column '>
                            <button class="btn btn-success mt-4"
                                onClick={handleGuardarIngreso}>Guardar</button> <br></br>
                            <Link to={'/Ingresos'} className='btn btn-light' style={{ color: 'white', background: 'purple' }}>Cancelar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default IngresosTabla