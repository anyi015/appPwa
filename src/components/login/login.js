import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Api/firebaseConfig';
//import { NavLink, useNavigate } from 'react-router-dom'
import gastos from '../../assets/GastosPersonales2.svg';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import {useUser} from '../../UserContext'

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");
    const { setUser } = useUser();


    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setUser({ email });
            // Limpiar los estados después de un inicio de sesión exitoso
            setEmail("");
            setPassword("");
            setNotice("");
            navigate("/home");
            
        } catch {
            setNotice("Tu correo o contraseña son incorrectos.");
        }
    }

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
                            <Navbar style={{color:'transparent', backgroundColor:'transparent'}}>
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
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor="exampleInputEmail1" className="form-label">Correo:</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <label htmlFor="exampleInputPassword1" className="form-label">Contraseña:</label>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-light pt-3 pb-3" style={{ color: 'white', background: 'purple' }} onClick={(e) => loginWithUsernameAndPassword(e)}>Ingresar</button>
                    </div>
                    <div className="mt-3 text-center">
                        <span>Necesitas una cuenta para ingresar? <Link to="/signup" style={{ color: 'purple' }}  >Haz click aquí.</Link></span>
                    </div>
           
                </form>
               
            </div>
           
        </div>
    )

}

export default Login

