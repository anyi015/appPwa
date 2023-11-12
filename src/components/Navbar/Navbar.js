//import {useNavigate} from 'react-router-dom';
import { useState, React, useEffect} from 'react'
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
//import { Link } from 'react-router-dom';
import gastos from '../../assets/GastosPersonales2.svg';
import {auth} from '../../Api/firebaseConfig';
import {signOut} from 'firebase/auth';
import {CNavbar, CNavbarBrand,CNavbarNav, CContainer,CNavbarToggler,COffcanvas, COffcanvasHeader
, COffcanvasTitle, CCloseButton, COffcanvasBody,CNavItem,CNavLink,CForm,CFormInput,CButton, CCardBody} from '@coreui/react';
import { Outlet} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {useUser} from '../../UserContext'
export function  MyNavbar (){
	const [visible, setVisible] = useState(false)
	const navigate = useNavigate();
	const { user } = useUser();
	 // Agregar lógica para determinar si el usuario está autenticado
	 const isAuthenticated = true; // Cambia esto a la lógica real de autenticación

	 const handleLogout = () => {
		 // Agrega aquí tu lógica de cierre de sesión
		 // Por ejemplo, si estás utilizando Firebase Authentication:
		 // auth.signOut().then(() => { ... });
		 // Luego, redirige al usuario a la página de inicio.
		 // navigate("/");
		 signOut(auth).then(() => {
			// Sign-out successful.
				navigate("/");
				console.log("Signed out successfully")
			}).catch((error) => {
			// An error happened.
			});
		}                                      
	 
	
		return (
			<CNavbar colorScheme="light" className="bg-light" expand="xxl">
			<CNavbarBrand style={{justifyContent:'center'}}>
			<img src={gastos} style={{width:'300px'}} />
			</CNavbarBrand>
			<CNavbarToggler
				aria-controls="offcanvasNavbar2"
				aria-label="Toggle navigation"
				onClick={() => setVisible(!visible)}
		
			  />
			<CContainer fluid  style={{textAlign:'center'}}>
			  
			  <COffcanvas id="offcanvasNavbar2" placement="end" portal={false} visible={visible} onHide={() => setVisible(false)}>
				<COffcanvasHeader>
				  <COffcanvasTitle style={{color:'purple'}}>MisFinanzasPersonales</COffcanvasTitle>
				  <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
				</COffcanvasHeader>
				<COffcanvasBody style={{justifyContent:'space-around'}}>
				  <CNavbarNav >
					<CNavItem>
					  <CNavLink href="/" active>
					  <i class="fa fa-home" aria-hidden="true" style={{color:'black', width:'18px'}}></i>
						Home
					  </CNavLink>
					</CNavItem>
					<CNavItem >
					  <CNavLink href="/CategoriasTabla">
					<i aria-hidden="true" style={{color:'black', width:'18px'}} class="fa-solid fa-table"></i>
						Categorias</CNavLink>
					</CNavItem>
					<CNavItem>
					  <CNavLink href="/informes">
					  <i aria-hidden="true" style={{color:'black', width:'18px' }}  class="fa-solid fa-chart-line"></i>	
						Informes</CNavLink>
					</CNavItem>
					
				  </CNavbarNav>
				  {isAuthenticated && user && (
              <div>
                <div className="navbar-text">
                 Bienvenido! {user.email}
                </div>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </div>
                            )}
				</COffcanvasBody>
			  </COffcanvas>
			
			
			</CContainer>
		  </CNavbar>		  
		)
		
	}	
	

	
	 <Outlet/>

export default MyNavbar
