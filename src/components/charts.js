import React, { useMemo, useEffect, useState } from "react";
import { db } from '../Api/firebaseConfig';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import {Doughnut} from 'react-chartjs-2'
  ChartJS.register(
    Title,
    Tooltip,
    Legend
  );

const options = {
    responsive: true,
    maintainAspectRatio: false, // Para permitir que la gráfica se ajuste al contenedor
    plugins: {
      legend: {
        display: true,
        position: 'right', // Posición de la leyenda
      },
    },
  };
  export default function IngresosPieChart() {
    const [ingresos, setIngresos] = useState([]);
  
    useEffect(() => {
      const unsubscribe = db.collection('Ingresos').onSnapshot((snapshot) => {
        const nuevosIngresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setIngresos(nuevosIngresos);
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    const data = useMemo(() => {
        const values = ingresos.map((ingreso) => parseFloat(ingreso.valor));
        const labels = ingresos.map((ingreso) => ingreso.fecha);
    
    return {
                datasets: [
                    {
                      data: values,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800', '#9C27B0'],
                        
            },
            ],
            labels,
          };
        }, [ingresos]);
  
        return (
            <div className="App" style={{ width: '300px', height: '300px' }}>
            <Doughnut data={data} options={options} />
          </div>
  );
}