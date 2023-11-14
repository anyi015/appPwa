import React, { useState } from 'react'
import { auth, createNewUserCollections, db} from '../../Api/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import gastos from '../../assets/GastosPersonales2.svg';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


export const Signup = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notice, setNotice] = useState("");

    const signupWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            try {
                // Registrar al usuario con correo y contraseña
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

              // Asegurarse de que el campo 'password' esté definido
      const passwordToSave = password || "";

     // Guardar información del usuario en la subcolección "infousuarios"
      await db.collection('usuarios').doc(user.uid).collection('infousuarios').doc('perfil').set({
        email: user.email,
        password: passwordToSave,
        // Otros datos que desees almacenar
      });
                navigate("/");
            } catch (error) {
                setNotice("Lo siento, algo salió mal. Inténtalo de nuevo.");
                console.error('Error al crear el usuario:', error);
            }
        } else {
            setNotice("Las contraseñas no coinciden. Inténtalo de nuevo.");
        }
    };

    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        try {
            // Iniciar sesión con correo y contraseña
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            setNotice("Credenciales incorrectas. Inténtalo de nuevo.");
            console.error('Error al iniciar sesión:', error);
        }
    };



    return (


        <div className="container">
            <div className="row justify-content-center">
                <form className="col-md-4 mt-3 pt-3 pb-3">
                    {"" !== notice &&
                        <div className="alert alert-warning" role="alert">
                            {notice}
                        </div>
                    }

                    <div>
                        <div>
                            <Navbar style={{ color: 'transparent', backgroundColor: 'transparent' }}>
                                <Container>
                                    <Navbar.Brand href="#home">
                                        <img
                                            src={gastos}
                                            width="300"
                                            alt="React Bootstrap logo"
                                        />
                                    </Navbar.Brand>
                                </Container>
                            </Navbar>
                        </div>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="signupEmail" type="email" className="form-control" aria-describedby="emailHelp" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor="signupEmail" className="form-label">Correo:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="signupPassword" type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <label htmlFor="signupPassword" className="form-label">Contraseña:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input id="confirmPassword" type="password" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                        <label htmlFor="confirmPassword" className="form-label">Confirma contraseña:</label>
                    </div>
                    <div className="d-grid">
                    <button type="submit" className="btn bbtn-light pt-3 pb-3" style={{ color: 'white', background: 'purple' }} onClick={(e) => signupWithUsernameAndPassword(e)}>Registrar</button>
                          </div>
                    <div className="mt-3 text-center">
                        <span>Volver al login? <Link to="/" style={{ color: 'purple' }}>Haz click aquí.</Link></span>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Signup

