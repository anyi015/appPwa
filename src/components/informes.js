// import React, { useState, useEffect} from 'react'
// import { Line, Bar } from 'react-chartjs-2';
// import { db } from '../Api/firebaseConfig';

// export function Informes(){

//   const [datosGastos, setDatosGastos] = useState([]);
//   const [datosIngresos, setDatosIngresos] = useState([]);


//   useEffect(() => {
//     // Aquí debes obtener tus datos de Firebase para gastos e ingresos y actualizar los estados.

//     // Ejemplo de cómo obtener los datos de gastos desde Firebase (adapta a tus necesidades):
//     db.collection('Gastos')
//       .get()
//       .then((querySnapshot) => {
//         const gastos = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           gastos.push({ fecha: data.fechaGasto, valor: data.valorGasto });
//         });
//         setDatosGastos(gastos);
//       });

//     // Haz lo mismo para obtener los datos de ingresos.
//     db.collection('Ingresos')
//       .get()
//       .then((querySnapshot) => {
//         const ingreso = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           ingreso.push({ fecha: data.fecha, valor: data.valor });
//         });
//         setDatosGastos(ingreso);
//       });

//   }, []);

//   // Procesar los datos para agruparlos por mes (puedes adaptarlo según la estructura de tus datos).
//   const gastosPorMes = datosGastos.reduce((result, gasto) => {
//     const [year, month] = gasto.fecha.split('-');
//     const key = `${year}-${month}`;
//     result[key] = (result[key] || 0) + gasto.valor;
//     return result;
//   }, {});

//   const ingresosPorMes = datosIngresos.reduce((result, ingreso) => {
//     const [year, month] = ingreso.fecha.split('-');
//     const key = `${year}-${month}`;
//     result[key] = (result[key] || 0) + ingreso.valor;
//     return result;
//   }, {});
//   const meses = Object.keys(gastosPorMes);
//   const gastos = Object.values(gastosPorMes);
//   const ingresos = Object.values(ingresosPorMes);

//   // Definición de los datos para el gráfico de barras
//   const dataBar = {
//     labels: meses,
//     datasets: [
//       {
//         label: 'Gastos',
//         data: gastos,
//         backgroundColor: 'red',
//       },
//       {
//         label: 'Ingresos',
//         data: ingresos,
//         backgroundColor: 'green',
//       },
//     ],
//   };

//     return (
//        <div>
//       <h1>Informe de Gastos e Ingresos por Mes</h1>
//       <Bar data={dataBar} />
//     </div>
//     )
//   }


// export default Informes
