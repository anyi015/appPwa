import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db, storage } from '../../Api/firebaseConfig';

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

        // Obtener datos de Firebase para Categorías
        const unsubscribeCategorias = db.collection('categorias').onSnapshot((snapshot) => {
            const nuevaCategorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCategorias(nuevaCategorias);
        });

        // Obtener datos de Firebase para Cuentas
        const unsubscribeCuentas = db.collection('cuentas').onSnapshot((snapshot) => {
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
        // Subir la imagen a Firebase Storage
        if (imagenGasto) {
            const storageRef = storage.ref(`imagenes/${imagenGasto.name}`);
            storageRef.put(imagenGasto).then((snapshot) => {
                console.log('Imagen subida con éxito');
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Crear un objeto con los datos a guardar
                    const nuevoGasto = {
                        gasto: gasto,
                        fechaGasto: fechaGasto,
                        valorGasto: valorGasto,
                        nombreCategoria: nombreCategoria,
                        cuentaInstitucion: cuentaInstitucion,
                        imagenUrl: downloadURL, // URL de la imagen subida
                    };

                    // Guardar los datos en la base de datos
                    db.collection('Gastos')
                        .add(nuevoGasto)
                        .then((docRef) => {
                            console.log('Gasto guardada con ID: ', docRef.id);
                            // Realizar cualquier acción adicional después de guardar los datos, como redirigir al usuario.
                            // Redirige al usuario a la vista de ingresos
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