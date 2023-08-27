import SupplierComponent from '../_Container/SupplierComponent'
import DistributorComponent from '../_Container/DistributorComponent'
import '../../styles/scss/distributor-section.scss'
import { Divider, Button} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
const Distributor = ({ pageTitle }) => {
  return (
    <div className="container">
      <h1>{pageTitle}</h1>
      <Divider />
      <div className="main-content">
        <div className="my-col first distributor-col">
          <div className="wrap-table">
            <DistributorComponent />
          </div>
        </div>
        <div className="my-col second supplier-col">
          <div className="wrap-table">
            <SupplierComponent />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Distributor;



