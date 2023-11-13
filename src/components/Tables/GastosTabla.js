import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage, auth } from '../../Api/firebaseConfig';

function GastosTabla() {
    const navigate = useNavigate(); // Obtiene la instancia de useHistory
    const [gasto, setGasto] = useState('');
    const [cuentaInstitucion, setCuentaInstitucion] = useState('');
    const [valorGasto, setValorGasto] = useState('');
    const [fechaGasto, setFechaGasto] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [cuentas, setCuentas] = useState([]);
    // Almacenar el archivo de imagen
    const [imagenGasto, setImagenGasto] = useState(null);

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setImagenGasto(file);
    };

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            // Redirige al usuario a la página de inicio de sesión si no está autenticado
            navigate('/login');
            return;
        }

        const userId = user.uid;

        // Obtener datos de Firebase para Categorías
        const unsubscribeCategorias = db.collection('usuarios').doc(userId).collection('categorias').onSnapshot((snapshot) => {
            const nuevasCategorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCategorias(nuevasCategorias);
        });

        // Obtener datos de Firebase para Cuentas
        const unsubscribeCuentas = db.collection('usuarios').doc(userId).collection('cuentas').onSnapshot((snapshot) => {
            const nuevasCuentas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCuentas(nuevasCuentas);
          });

        // Limpia las suscripciones cuando la vista se desmonta
        return () => {
            unsubscribeCategorias();
            unsubscribeCuentas();
        };
    }, []);


    const handleGuardarGasto = () => {
        const user = auth.currentUser;

        if (!user) {
            navigate('/login');
            return;
        }

        const userId = user.uid;

        if (imagenGasto) {
            const storageRef = storage.ref(`imagenes/${imagenGasto.name}`);
            storageRef.put(imagenGasto).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    const nuevoGasto = {
                        gasto: gasto,
                        fechaGasto: fechaGasto,
                        valorGasto: valorGasto,
                        nombreCategoria: nombreCategoria,
                        cuentaInstitucion: cuentaInstitucion,
                        imagenUrl: downloadURL,
                    };

                    db.collection('usuarios')
                        .doc(userId)
                        .collection('gastos')
                        .add(nuevoGasto)
                        .then((docRef) => {
                            console.log('Gasto guardado con ID: ', docRef.id);
                            navigate('/Gastos');
                        })
                        .catch((error) => {
                            console.error('Error al guardar el gasto: ', error);
                        });
                });
            });
        } else {
            console.error('Debes seleccionar una imagen');
        }
    };



    return (
        <section>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-8 col-xl-6">
                        <div class="row">
                            <div class="col text-center">
                                <h1>Nuevo Gasto</h1>
                                <p class="text-h3">Agrega un nuevo gasto para administrar mejor tu dinero! </p>
                            </div>
                        </div>

                        <div class="row align-items-center">

                            <div class="col mt-4">
                                <label htmlFor='gasto' className='form-label'>
                                    Nombre del gasto:
                                </label>
                                <input type="text"
                                    class="form-control"
                                    placeholder="ej. Pago del agua"
                                    value={gasto}
                                    onChange={(e) => setGasto(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row align-items-center mt-4">
                            <div className="col">
                                <label htmlFor='gasto' className='form-label'>
                                    Nombre de la categoria:
                                </label>
                                <select
                                    className="form-control"
                                    value={nombreCategoria}
                                    onChange={(e) => setNombreCategoria(e.target.value)}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.nombre}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
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
                            <label htmlFor='gasto' className='form-label'>
                                    Fecha:
                                </label>
                                <input type="date"
                                    class="form-control"
                                    placeholder="Fecha"
                                    value={fechaGasto}
                                    onChange={(e) => setFechaGasto(e.target.value)} />
                            </div>
                        </div>

                        <div class="row align-items-center mt-4">
                            <div class="col">
                                <label htmlFor='gasto' className='form-label'>
                                    Selecciona una imagen:
                                </label>
                                <br></br>
                                <input
                                    type="file"
                                    onChange={handleImagenChange}
                                />
                            </div>
                        </div>

                        <div class="row align-items-center mt-4">
                            <div class="col">
                                <label htmlFor='gasto' className='form-label'>
                                    Valor:
                                </label>
                                <input type="text"
                                    class="form-control"
                                    placeholder="$ Valor"
                                    value={valorGasto}
                                    onChange={(e) => setValorGasto(e.target.value)} />

                            </div>
                        </div>




                        <div className='align-items-center d-flex flex-column '>
                            <button class="btn btn-success mt-4"
                                onClick={handleGuardarGasto}>Guardar</button> <br></br>


                            <Link to={'/Gastos'} className='btn btn-light' style={{ color: 'white', background: 'purple' }}>Cancelar</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default GastosTabla