import React from 'react'
import { Link } from 'react-router-dom'

function ViewCuenta() {
  return (
    <div>
      <React.Fragment>
        <section className='view-cuenta'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
              <h1>Detalles</h1>
              <p class="text-h3">Agrega una cuenta nueva para administrar mejor tu dinero! </p>
              </div>
            </div>
          </div>
        </section>
        <section className='view-contact mt-3'>
          <div className='container'>
            <div className='row align-items-center'>
              <div className='col-md-4'>
              <img src='https://creazilla-store.fra1.digitaloceanspaces.com/emojis/42134/bank-emoji-clipart-md.png' alt=''  className='cuenta-image'></img>

              </div>
              <div className='col-md-8'>
              <ul className='list-group'>
        <li className='list-group-item list-group-item-action'>
      Inntitucion financiera: <span>BBVA</span>
        </li>
        <li className='list-group-item list-group-item-action'>
      Descripcion: <span>fwfsfwfww</span>
        </li>
        <li className='list-group-item list-group-item-action'>
      Saldo Actual: <span>$12584</span>
        </li>
      </ul>
              </div>
            </div>
            <div className='row'>
          <div className='align-items-center d-flex flex-column'>
          <br></br>
        <Link to={'/cuenta'} className="btn btn-light pt-3 pb-3" style={{ color: 'white', background: 'purple' }}>Regresar</Link>
          </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    </div>
  )
}

export default ViewCuenta
