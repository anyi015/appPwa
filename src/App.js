import React from 'react';
import Home from './components/home';
import Categorias from './components/categorias';
import Informes from './components/informes';
import Navbar, { MyNavbar } from './components/Navbar/Navbar';
import {BrowserRouter, Routes, Route, Router} from 'react-router-dom';
import RegistrarCategoria from './components/RegistrarCategoria';
import CategoriasTabla from './components/Tables/CategoriasTabla'; 


import {Login, Signup}  from './components/home';
import Layout from './components/Navbar/Navbar';
import MaybeShowNavbar from './components/login/MaybeShowNavbar';
import Cuenta from './components/cuenta';
import Ingresos from './components/ingresos';
import Gastos from './components/Gastos';
import Objetivos from './components/Objetivos';
import NCuentaTabla from './components/Tables/NCuentaTabla';
import EditarGastos from './components/crud/EditGastos'
import EditarIngresos from './components/crud/EditIngresos'
import EditarObjetivos from  './components/crud/EditObjetivos'
import VistaCuenta from './components/crud/ViewCuenta'
import VistaGastos from './components/crud/ViewGastos'
import VistaIngresos from './components/crud/ViewIngresos'
import VistaObjetivos from './components/crud/ViewObjetivos'
import IngresosTabla from './components/Tables/IngresosTabla';
import ObjetivosTabla from './components/Tables/ObjetivosTabla';
import GastosTabla from './components/Tables/GastosTabla';

const App = () => {
  return ( 
    <>
    <BrowserRouter>
    <MaybeShowNavbar>
          <Navbar></Navbar>
        </MaybeShowNavbar>
      <Routes>
            <Route index element = { <Login></Login> }></Route>
            <Route path = "/signup" element = { <Signup></Signup> } ></Route>
            <Route path = "/home" element = { <Home></Home> } ></Route>
            <Route path = "/cuenta" element = { <Cuenta></Cuenta> } ></Route>
            <Route path='/Ingresos' element={ <Ingresos></Ingresos> } ></Route>
            <Route path='/Informes' element={<Informes></Informes>} ></Route>
            <Route path='/Gastos' element={<Gastos></Gastos> } ></Route>
            <Route path='/GastosTabla' element={<GastosTabla></GastosTabla> } ></Route>
            <Route path='/Categorias' element={<Categorias></Categorias> } ></Route>
            <Route path='/CategoriasTabla' element={<CategoriasTabla></CategoriasTabla> } ></Route>
            <Route path='/IngresosTabla' element={<IngresosTabla></IngresosTabla> } ></Route>
            <Route path='/ObjetivosTabla' element={<ObjetivosTabla></ObjetivosTabla> } ></Route>
            <Route path='/RegistrarCategoria' element={<RegistrarCategoria></RegistrarCategoria> } ></Route>
            <Route path='/Objetivos' element={<Objetivos></Objetivos>} ></Route>
            <Route path='/NCuentaTabla' element={<NCuentaTabla></NCuentaTabla>} ></Route>
            <Route path='/EditGastos' element={<EditarGastos></EditarGastos> } ></Route>
            <Route path='/EditIngresos' element={<EditarIngresos></EditarIngresos> } ></Route>
            <Route path='/EditObjetivos' element={<EditarObjetivos></EditarObjetivos> } ></Route>
          <Route path='/ViewCuenta' element={<VistaCuenta></VistaCuenta> } ></Route>
          <Route path='/ViewObjetivos' element={<VistaObjetivos></VistaObjetivos> } ></Route>
          <Route path='/ViewIngresos' element={<VistaIngresos></VistaIngresos>} ></Route>
          <Route path='/ViewGastos' element={<VistaGastos></VistaGastos> } ></Route>
      </Routes>
    </BrowserRouter>
          </>  
  );
};

export default App
