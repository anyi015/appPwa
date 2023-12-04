import React, { useState } from 'react';
import Saldo from './/../assets/SaldoA.png'
import gastos from './/../assets/gastos.png'
import informes from './/../assets/Informes.png'
import objetivos from './/../assets/objetivos.png'

export function Ayuda() {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    
    <div class="container">
      <div className="ayuda-container">
      <br />
      <div>
        <h4 style={{ textAlign: 'center', fontWeight: '500', fontSize: 'x-large' }}>
          Cómo utilizar la página?
        </h4>
        <br />
        <p className="text-h3 text-center" style={{ fontWeight: '300' }}>
          Bienvenido a la página de ayuda. Aquí encontrarás información sobre cómo utilizar todas las funciones disponibles en Mis Finanzas Personales.
        </p>
        <br />

              {/* Agrega secciones adicionales según sea necesario */}
    <br></br>
      <div className="accordion-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <b><h3 className={`section-title ${expandedSections['section1'] ? 'expanded' : ''}`} onClick={() => toggleSection('section1')}>
          1. Agregar una nueva cuenta:
        </h3></b>
        {expandedSections['section1'] && (
         
          <p>
            Para agregar una nueva cuenta, ve a la sección principal, selecciona Saldo actual e ingresa a la opción "Agregar". Completa los campos requeridos, como el nombre de la Institucion financiera, descripción y saldo actual.
         
        <img src={Saldo}></img>
          </p>
        )}
    
      </div>

      <div className="accordion-section" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <b><h3 className={`section-title ${expandedSections['section2'] ? 'expanded' : ''}`} onClick={() => toggleSection('section2')}>
          2. Registro de gastos:
        </h3></b>
        {expandedSections['section2'] && (
          <p>
            En la sección de "Gastos", puedes subir fotos de recibos, asignar categorías y registrar la información detallada de tus gastos.
          <img src={gastos}></img>
          </p>
        )}
      </div>

      {/* Agrega más instrucciones según sea necesario */}

      <div className="accordion-section" style={{textAlign: 'center', marginBottom: '20px' }}>
        <b>
        <h3 className={`section-title ${expandedSections['section3'] ? 'expanded' : ''}`} onClick={() => toggleSection('section3')}>
          3. Informes:
        </h3>
        </b>
        {expandedSections['section3'] && (
          <p>
            Consulta informes detallados sobre tus ingresos, gastos y objetivos en la sección de "Informes". Los datos se clasifican por cuenta para una mejor comprensión.
         <img src={informes}></img>
          </p>
        )}
      </div>

      <div className="accordion-section" style={{textAlign: 'center', marginBottom: '20px' }}>
        <b>
        <h3 className={`section-title ${expandedSections['section4'] ? 'expanded' : ''}`} onClick={() => toggleSection('section4')}>
          4. Objetivos financieros:
        </h3>
        </b>
        {expandedSections['section4'] && (
          <p>
            Establece y realiza un seguimiento de tus objetivos financieros en la sección correspondiente. Recibirás notificaciones dos semanas antes de la fecha de finalización.
         <img src={objetivos}></img>
          </p>
        )}
      </div>
      </div>



      {/* Agrega más instrucciones según sea necesario */}
    </div>
      </div>
  );
}

export default Ayuda;
