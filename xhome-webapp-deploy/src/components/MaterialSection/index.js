import React, { useState, useEffect } from 'react'
import MaterialComponent from '../_Container/MaterialComponent'
import '../../styles/scss/material-section.scss'
import Icon from '@mdi/react'
import { mdiCogOutline } from '@mdi/js';
import { Divider, Button, Paper, Breadcrumbs, Link, Typography, Dialog, DialogContent } from '@material-ui/core'
import { Tab } from '@material-ui/core'
import { TabContext, TabList, TabPanel, MuiTabScrollButton } from '@material-ui/lab'
import SearchComponent from '../_Common/SearchComponent'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import DistributorComponent from '../_Container/DistributorComponent'
import TypeAndSegment from '../TypeAndSegmentSection'
import CatalogSection from '../CatalogSection'
import { TableProduct } from '../_Common/TableProduct'
import { ItemProduct } from "../_Common/ItemProduct"
import {
  getSupplierRequest
} from "../../constants/actionCreators"
import Pagination from '../_Common/PaginationComponent'
import { connect } from "react-redux"
const Material = ({ pageTitle }) => {
  const [openTabMaterial, setOpenTabMaterial] = useState(false);
  return (
    <div className="container">
      <h1>{pageTitle}</h1>
      {window.innerWidth <= 768 ?
        openTabMaterial && <Button variant="contained" className="btn-back" onClick={() => setOpenTabMaterial(false)}>Quay lại</Button>
        :
        null
      }
      <Divider />
      <div className="main-content">
        <div className="my-col first material-col" style={openTabMaterial ? { display: 'none' } : { display: 'block' }}>
          {window.innerWidth <= 768 ?
            <MaterialComponent
              openTabMaterial={() => setOpenTabMaterial(true)}
            />
            :
            <MaterialComponent
              openTabMaterial={() => setOpenTabMaterial(false)}
            />
          }
        </div>
        {window.innerWidth <= 768 ?
          <div className="my-col second product-col" style={!openTabMaterial ? { display: 'none' } : { display: 'block' }}>
            <Paper variant="outlined">
              <TabMaterial statusTabMaterial={openTabMaterial} />
            </Paper>
          </div>
          :
          <div className="my-col second product-col">
            <Paper variant="outlined">
              <TabMaterial statusTabMaterial={openTabMaterial} />
            </Paper>
          </div>
        }
      </div>
    </div>
  )
}
export default Material;

const mapStateToProps = (state) => ({
  listFraction: state.fraction.allListData,
  chooseId: state.material.chooseId,
  isLoadingSupplier: state.supplier.isLoading,
  isLoadingFraction: state.fraction.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  getSupplierDispatch: (data) => {
    dispatch(getSupplierRequest(data))
  }
})

const TabMaterial = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [value, setValue] = useState('1');
  const [show, setShow] = useState(true);
  const [openFraction, setOpenFraction] = useState(false);
  const [fractionId, setFractionId] = useState(0);
  const [supplierId, setSupplierId] = useState(0);
  const [supplierName, setSupplierName] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setShow(true);
  };
  useEffect(() => {
    setShow(true);
    if (props.listFraction.length > 0) {
      setFractionId(props.listFraction[0].id);
    } else {
      setFractionId(0)
    }
  }, [props.listFraction])

  useEffect(() => {
    setValue('1');
  }, [props.chooseId])
  const widthScreen = window.innerWidth
  return (
    <>
      {props.isLoadingFraction
        ?
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img width="30%" src={loadImg} />
        </div>
        :
        <TabContext value={value}>
          <TabList
            variant="scrollable"
            onChange={handleChange}
            aria-label="simple tabs example"
            className="tab-list"
          >
            {props.listFraction.map((fraction, index) => (<Tab onClick={() => {
              setFractionId(fraction.id);
              props.getSupplierDispatch({ pageIndex: 1, fractionId: fraction.id })
            }} key={index} label={fraction.name} value={`${index + 1}`} />))}
            {/* <SearchComponent /> */}
            <Button onClick={() => setOpenFraction(true)}><Icon path={mdiCogOutline} size={1} /></Button>

          </TabList>

          <TabPanel className="tab-panel" value={value}>
            {
              // widthScreen > 768 ?
              <div className="container-product-list">
                {show
                  ? (fractionId !== 0 &&
                    <DistributorComponent
                      fractionId={fractionId}
                      handleShowCatalog={(supplierName) => {
                        setShow(false);
                        setSupplierName(supplierName);
                      }}
                      setSupplierId={(id) => { setSupplierId(id) }}
                    />
                  )
                  :
                  <CatalogSection supplierId={supplierId} supplierName={supplierName} handleShowSupplier={() => setShow(true)} />}
              </div>
              // :
              // <ItemProduct />
            }
          </TabPanel>
          {/* <TabPanel className="tab-panel" value="2">
        {widthScreen > 768 ?
          <DistributorComponent />
          :
          <ItemProduct />
        }
      </TabPanel>
      <TabPanel className="tab-panel" value="3">
        {widthScreen > 768 ?
          <DistributorComponent />
          :
          <ItemProduct />
        }
      </TabPanel> */}
          {/* <div className="block-action">
        <div className="block-action-block" >
          <Button className="btn-add-new" variant="contained" onClick={()=>{handleOpen()}} >Thêm mới</Button>
          <DialogAddNewMaterials open = {open} />
          <Pagination {...props} typeTable='product' onPaginate={(activePage) => {
            props.getDataProduct({ activePage: activePage })
          }} />
          <span></span>
        </div>
      </div> */}
        </TabContext>
      }
      <Dialog fullWidth={true} maxWidth={"sm"} open={openFraction} onClose={() => setOpenFraction(false)}>
        {props.chooseId === 0 ?
          <DialogContent>
            <div style={{display:"flex", justifyContent:"center"}}>
              <p>Chưa chọn vật liệu. Vui lòng chọn 1 vật liệu!</p>
            </div>
          </DialogContent>
          :
          <TypeAndSegment pageTitle="Phân Khúc" />
        }
      </Dialog>
    </>
  )
})