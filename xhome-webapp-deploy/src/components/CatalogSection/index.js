import React, { useState, useEffect } from 'react'
import {
  Divider, Button, Breadcrumbs, Link, Typography, Dialog,
  DialogTitle, TextField, DialogContent, Input
} from '@material-ui/core'
import * as actions from '../../constants/actionCreators'
import Autocomplete from '@material-ui/lab/Autocomplete';
import ProductList from "./ProductList"
import SearchComponent from '../_Common/SearchComponent'
import CatalogComponent from "../_Container/CatalogComponent"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import emptyImg from "../../styles/images/no-images.png"
import {
  postProduct, searchCatalogRequest, getListCatalogRequest,
  searchCatalogIdRequest, getProductByIdRequest
} from "../../constants/actionCreators"
import "../../styles/scss/catalog-section.scss"
import '../../styles/scss/container/catalog-component.scss'
import { DOMAIN_IMAGE } from "../../constants/callAPI"
import uploadImage from "../../api/uploadImage"
import { mdiUpload } from '@mdi/js';
import Icon from '@mdi/react'
import { connect } from 'react-redux'

const DialogFormAddCatalog = connect(
  (state) => {
    return {
      listMaterial: state.formAdd.listMaterial,
      listAgency: state.formAdd.listAgency,
      listFaction: state.formAdd.listFraction,
    }
  },
  (dispatch) => {
    return {
      getMaterial: (data) => {
        dispatch(actions.getMaterialForm(data))
      },
      getMaterialSearch: (data) => {
        dispatch(actions.getMaterialSearchForm(data))
      },
      getAgency: (data) => {
        dispatch(actions.getAgencyForm(data))
      },
      getFraction: (data) => {
        dispatch(actions.getFractionForm(data))
      },
      addCatalog: (data) => {
        dispatch(actions.addCatalogRequest(data))
      },
    }
  }
)((props) => {
  const [openFraction, setOpenFraction] = useState('none')
  const [material, setMaterial] = useState('')
  const [agency, setAgency] = useState('')
  const [listAgency, setListAgency] = useState([])
  const [idAgency, setIdAgency] = useState('')
  const [fraction, setFraction] = useState('')
  const [listFraction, setListFraction] = useState([])
  const [openAgency, setOpenAgency] = useState('none')
  const [listMaterial, setListMaterial] = useState([])
  const [openCatalog, setOpenCatalog] = useState('none')
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const animationLoading = loadImg;
  useEffect(() => setListMaterial(props.listMaterial), [props.listMaterial])
  useEffect(() => setListAgency(props.listAgency), [props.listAgency])
  useEffect(() => setListFraction(props.listFaction), [props.listFaction])
  const handleSelectFileAdd = async (event) => {
    setIsLoadingImage(true)
    const imageFile = event.target.files[0];

    if (!imageFile) {
      alert('Vui lòng chọn ảnh!')
      setIsLoadingImage(false)
      return false;
    }

    if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
      alert('Định dạng ảnh không hỗ trợ!')
      setIsLoadingImage(false)
      return false;
    }

    const res = await uploadImage(imageFile)
    if (res.err) {
      alert("Đã xảy ra lỗi khi thêm ảnh!")
      setIsLoadingImage(false)
    } else {
      setImageUrl(DOMAIN_IMAGE + res.fileName)
    }
  }
  return (
    <Dialog
      open={props.openDialog}
    // onClick={() => setOpenDialog(false)}
    >
      <div className="container">
        <DialogTitle className="title-add-new-materials"
        >
          <label className="title-head">
            <Typography variant="h6">Lựa chọn thêm quyển</Typography>
            {/* <Icon onClick={() => props.handleClose()} path={mdiCloseThick} size={1} /> */}
          </label>
          <Divider />
        </DialogTitle>
        <DialogContent className="content-add-new-materials">
          <div className="wrap-block-add-new-materials">
            <div className="block-input-info">
              <div className="form-input" >
                <Typography>Vật liệu</Typography>
                <Autocomplete
                  className="input-filter"
                  size="small"
                  options={listMaterial}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 250 }}
                  renderInput={
                    (params) =>
                      <TextField {...params} placeholder="Chọn Vật Liệu" variant="outlined"
                        onChange={(e, value) => {
                          {
                            if (e.target.value === '') {
                              props.getMaterial()
                            } else {
                              props.getMaterialSearch(e.target.value)
                            }
                          }
                        }}
                      />
                  }
                  onChange={(e, value) => {
                    if (!e.target.value) {
                      props.getMaterial(1)
                    }
                    if (!value) {
                      setOpenFraction("none")
                      // setOpenDistributerAndCatalog("none")
                      setOpenAgency("none")
                      setMaterial('')
                      setAgency('')
                      setFraction('')
                      // setDistributor('')
                      // setCatalogName('')
                      // setCatalog(0)
                    } else {
                      setOpenFraction("block")
                      props.getFraction(value.id)
                      setMaterial(value.name)
                    }
                  }}
                  onFocus={(e, value) => {
                    props.getMaterial(1);
                  }}
                />
              </div>
              <div className="form-input" style={{ display: openFraction }}>
                <Typography>Phân khúc</Typography>
                <Autocomplete
                  className="input-filter"
                  size="small"
                  // value={{ name: fraction }}
                  options={listFraction}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} placeholder="Chọn Phân Khúc" variant="outlined"
                    onChange={(e) => {
                    }}
                  />}
                  onChange={(e, value) => {
                    if (!value) {
                      setOpenAgency("none")
                      // setOpenDistributerAndCatalog("none")
                      setFraction('')
                      // setDistributor('')
                      setAgency('')
                      // setCatalogName('')
                      // setCatalog(0)
                    } else {
                      setOpenAgency("block")
                      props.getAgency(value.id)
                      setFraction(value.name)
                    }
                  }}
                />
              </div>
              <div className="form-input" style={{ display: openAgency }}>
                <Typography>Nhà cung cấp</Typography>
                <Autocomplete
                  className="input-filter"
                  size="small"
                  options={listAgency}
                  getOptionLabel={(option) => option.supplier}
                  // value={{ supplier: agency }}
                  style={{ width: 250 }}
                  renderInput={(params) => <TextField {...params} placeholder="Chọn Nhà Cung Cấp" variant="outlined"
                    onChange={(e) => {
                      if (e.target.value === '') {
                        // props.getAgencyForcus()
                      } else {
                        props.getAgency(e.target.value)
                      }
                    }}
                  />}
                  onChange={(e, value) => {
                    if (!e.target.value) {
                      // props.getAgencyForcus()
                    }
                    if (!value) {
                      // setOpenDistributerAndCatalog("none")
                      setAgency('')
                      // setDistributor('')
                      // setCatalogName('')
                      // setCatalog(0)
                    } else {
                      // props.getDistributor(value.title)
                      // setOpenDistributerAndCatalog("block")
                      setIdAgency(value.id)
                      // props.getCatalog(value.id)
                      setOpenCatalog("block")
                      setAgency(value.supplier)
                    }
                  }}
                />
              </div>
              <div className="form-input" style={{ display: openCatalog }}>
                <TextField id="outlined-basic" label="Tên quyển" variant="outlined" className="input-add-catalog" onChange={(e) => setName(e.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img class={isLoadingImage ? "upload-new-catalog" : "isUploading"} src={animationLoading} />
                  <img class={isLoadingImage ? 'isUploading' : "upload-new-catalog"}
                    onLoad={() => setIsLoadingImage(false)}
                    src={imageUrl ? imageUrl : emptyImg} />
                  <div style={{ display: 'flex', height: 125, alignItems: 'flex-end', marginLeft: 10 }}>
                    <Button className="button-upload-catalog" variant="contained" component="label">
                      Tải ảnh
                      <Icon path={mdiUpload} size={1} />
                      <input
                        type="file"
                        onChange={handleSelectFileAdd}
                        hidden
                      />
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  component="label"
                  style={{ width: '49%', color: 'white', backgroundColor: '#3F51B5' }}
                  onClick={() => {
                    if (name === '' || idAgency === '') {
                      window.alert('Bạn cần chọn nhà cung cấp và nhập tên quyển')
                    } else {
                      if (isLoadingImage === false) {
                        props.addCatalog({ id: idAgency, name: name, imageUrl: imageUrl });
                        setOpenAgency('none');
                        setOpenCatalog('none');
                        setOpenFraction('none');
                        setImageUrl(null);
                        setIdAgency('');
                        setName('')
                        props.setOpenDialog(false);
                      }else{
                        alert('Ảnh chưa tải xong, vui lòng đợi!')
                      }
                    }
                  }}
                >Thêm quyển</Button>
                <Button
                  variant="contained"
                  component="label"
                  style={{ width: '49%', color: 'white', backgroundColor: '#ca494d' }}
                  onClick={() => {
                    props.setOpenDialog(false);
                    setOpenAgency('none');
                    setOpenCatalog('none');
                    setOpenFraction('none');
                    setImageUrl(null);
                    setIdAgency('');
                    setName('')
                    props.setOpenDialog(false);
                  }}
                >Hủy</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  )
})

const mapDispatchToProps = (dispatch) => {
  return {
    addProduct: (data) => {
      dispatch(postProduct(data))
    },
    searchCatalog: (data) => {
      dispatch(searchCatalogRequest(data))
    },
    searchCatalogById: (data) => {
      dispatch(searchCatalogIdRequest(data))
    },
    getListCatalogRequest: (data) => {
      dispatch(getListCatalogRequest(data))
    },
    getProductByCatalog: (data) => dispatch(getProductByIdRequest(data))
  }
}

const Catalog = connect((state) => ({keyWord: state.productReducer.keyWord}), mapDispatchToProps)((props) => {
  const [show, setShow] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [openModalAddProduct, setOpenModalAddProduct] = useState(false)
  const [catalogName, setCatalogName] = useState('')
  const [idCatalog, setIdCatalog] = useState(null)
  const [title, setTitle] = useState('')
  const [itemProduct, setItemProduct] = useState('')
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div className="container">
      {window.location.pathname.match("catalog") &&
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '20px 0' }}>
            <h1 style={{ display: "inline", margin: 0 }}>{props.pageTitle}</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                className="btn-create-project"
                onClick={() => { setOpenDialog(true) }}
                variant="contained"
                component="label"
              >Thêm quyển
            </Button>
              <DialogFormAddCatalog
                openDialog={openDialog}
                setOpenDialog={(status) => setOpenDialog(status)}
              />
              {/* <Button 
                    style ={{backgroundColor : 'red'}}
                    onClick={()=>{setOpenDialog(true)}}
                >Khởi Tạo Dự Án</Button>    */}
              {/* <ProjectCreation handleOpen = {openDialog} /> */}
            </div>
          </div>
          <Divider />
        </>
      }
      <div className="product-list-head" style={window.innerWidth <= 500 ? {display: 'block'} : { display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <Breadcrumbs style={{ margin: '14px 0', cursor: 'pointer' }}>
          {
            window.location.pathname.match("catalog") && catalogName &&
            <Link color="inherit"
              // href="/dashboard/catalog"
              onClick={() => { setShow(true); setCatalogName('') }}
            >
              Quay lại
              </Link>
          }
          {window.location.pathname.match("material") &&
            <Link color="inherit"
              // href="/dashboard/catalog"
              onClick={() => props.handleShowSupplier()}
            >
              Nhà cung cấp
                    </Link>
          }

          {window.location.pathname.match("material") &&
            (show
              ? <Typography style={{color:"#d32f2f"}} color="textPrimary">{props.supplierName}</Typography>
              :
              <Link color="inherit"
                // href="/dashboard/catalog"
                onClick={() => { setShow(true); setCatalogName('') }}
              >
                {props.supplierName}
              </Link>)
          }
          <Typography style={{color:"#d32f2f"}} color="textPrimary">{catalogName}</Typography>
        </Breadcrumbs>
        <div className="action-right" >
          {!show && <Button
            variant="contained"
            // addProduct={(data) => props.addProduct(data)}
            onClick={() => {
              setOpenModalAddProduct(true)
              setTitle('Thêm')
              setItemProduct('')
            }}
            style={window.innerWidth >= 500 ? { position: 'absolute', top: '20%', right: '0%', width: 150 } : { position: 'relative' }}
          >Thêm sản phẩm</Button>}
          {/* <SearchComponent /> */}
        </div>
      </div>
      {/* <div
      // style={{ marginTop: 20, marginLeft: 40 }}
      >
        <SearchComponent
          // textSearch={props.textSearch}
          search={(data) =>
            data.textSearch === ""
              ?
              ((window.location.pathname.match("catalog")
                ?
                props.getListCatalogRequest(1)
                :
                props.searchCatalogById({ supplierId: props.supplierId, textSearch: data.textSearch, pageIndex: data.pageIndex }))
              )
              :
              ((window.location.pathname.match("catalog")
                ?
                props.searchCatalog(data)
                :
                props.searchCatalogById({ supplierId: props.supplierId, textSearch: data.textSearch, pageIndex: data.pageIndex }))
              )
          }
        />
      </div> */}
      <div className="main-content">
        <div className="my-col first catalog-col">
          {show ?
            <div key="1">
              <SearchComponent
                // textSearch={props.textSearch}
                search={(data) =>
                  data.textSearch === ""
                    ?
                    ((window.location.pathname.match("catalog")
                      ?
                      props.getListCatalogRequest(1)
                      :
                      props.searchCatalogById({ supplierId: props.supplierId, textSearch: data.textSearch, pageIndex: data.pageIndex }))
                    )
                    :
                    ((window.location.pathname.match("catalog")
                      ?
                      props.searchCatalog(data)
                      :
                      props.searchCatalogById({ supplierId: props.supplierId, textSearch: data.textSearch, pageIndex: data.pageIndex }))
                    )
                }
              />
              <CatalogComponent
                handleShowProduct={(catalogName) => { setShow(false); setCatalogName(catalogName) }}
                handleGetIdCatalog={(idCatalog) => { setIdCatalog(idCatalog) }}
              />
            </div>
            :
            <div key="2">
              <SearchComponent
                search={(data) => {
                  props.getProductByCatalog({
                    id: idCatalog,
                    activePage: 1,
                    textSearch: data.textSearch
                  })
                }}
              />
              <ProductList
                handleShow={() => setShow(true)}
                openModal={openModalAddProduct}
                idCatalog={idCatalog}
                setOpenModal={(val) => { setOpenModalAddProduct(val) }}
                setTitleButton={(val) => setTitle(val)}
                title={title}
                itemProduct={itemProduct}
                setItemProduct={(val) => setItemProduct(val)}
                textSearch={props.keyWord}
              />
            </div>
          }
        </div>
        {/* <div className="my-col second"> */}
        {/* </div> */}
      </div>
    </div>
  )
});

export default Catalog;


