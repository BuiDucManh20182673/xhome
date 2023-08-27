import React, { useState, useEffect } from 'react';
import {
    Button, Typography,
    TextField, Input,
    Dialog, DialogTitle, DialogContent, DialogActions, TextareaAutosize, debounce,
} from '@material-ui/core';
import { Icon } from '@mdi/react'
import { mdiCloseThick, mdiMenuDown, mdiUpload } from '@mdi/js'
import emptyImg from "../../styles/images/no-images.png"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import { PopupChooseSegment, PopupChooseSupplier, PopupChooseDistributor, PopupChooseCatalog } from './SubModalProduct'
import "../../styles/scss/common/modal-product.scss"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DOMAIN_IMAGE } from "../../constants/callAPI"
import uploadImage from "../../api/uploadImage"
import { connect } from 'react-redux';
import * as actions from '../../constants/actionCreators'
import * as types from '../../constants/actionTypes'
/* Modal Thêm + Sửa Vật Liệu */
const DialogAddNewProduct = (props) => {
    return (
        <Dialog
            open={props.open}
            fullWidth={true}
            maxWidth="md"
        // onClose={() => props.handleClose()}
        >
            <AddNewProductMobile {...props} />
        </Dialog>
    )
}

const mapStateToPropsProduct = (state) => {
    return {
        listMaterial: state.formAdd.listMaterial,
        listFaction: state.formAdd.listFraction,
        listAgency: state.formAdd.listAgency,
        listCatalog: state.formAdd.listCatalog,
        listDistributor: state.formAdd.listDistributor,
        statusPost: state.formAdd.statusPost,
        isSuccessPending: state.listPendingReducer.isSuccess,
        isSuccessForm: state.formAdd.isSuccess,
    }
}

const mapDisptachToPropsProduct = (dispatch) => {

    return ({
        getMaterial: (data) => {
            dispatch(actions.getMaterialForm(data))
        },
        getMaterialSearch: (data) => {
            dispatch(actions.getMaterialSearchForm(data))
        },
        getFraction: (data) => {
            dispatch(actions.getFractionForm(data))
        },
        getAgency: (data) => {
            dispatch(actions.getAgencyForm(data))
        },
        getCatalog: (data) => {
            dispatch(actions.getCatalogForm(data))
        },
        postProduct: (data) => {
            dispatch(actions.postProductForm(data))
        },
        postProductInput: (data) => {
            dispatch(actions.postProductFormInput(data))
        },
        putProduct: (data) => {
            dispatch(actions.putProductForm(data))
        },
        postProductPending: (data) => {
            dispatch(actions.postProductPendingRequest(data))
        },
        putStatusPending: (data) => {
            dispatch(actions.putStatusPendingRequest(data))
        },
        getFractionAll: (data) => {
            dispatch(actions.getFractionForcus(data))
        },
        getAgencyAll: (data) => {
            dispatch(actions.getAgencyForcus(data))
        },
        getDistributorAll: (data) => {
            dispatch(actions.getDistributorAllForm(data))
        },
        getAgencySearch: (data) => {
            dispatch(actions.getAgencyFilter(data))
        },
        getCatalogAll: (data) => {
            dispatch(actions.getCatalogAllForm(data))
        },
        getCatalogSearch: (data) => {
            dispatch(actions.getCatalogSearchForm(data))
        },
        chooseMaterial: (data) => {
            dispatch(actions.chooseProductlAction(data))
        }
    })
}

const AddNewProductMobile = connect(mapStateToPropsProduct, mapDisptachToPropsProduct)
    ((props) => {
        if (JSON.parse(localStorage.getItem("UI")).viewMaterial === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
            useEffect(() => props.getMaterial(), []);
        }

        const [chooseFraction, setChooseFraction] = useState(false)
        const [disabled, setDisabled] = useState(false)

        const [imgUrlPreview, setImgUrlPreview] = useState(emptyImg)
        const [isLoadingImage, setIsLoadingImage] = useState(false)
        const [isLoadingImageCatalog, setIsLoadingImageCatalog] = useState(false)
        const [isPickedImage, setPickedImage] = useState(false)
        const [imgCatalogPreview, setImgCatalogPreview] = useState(emptyImg)
        const [openPopup, setOpenPopup] = useState({
            material: false,
            segment: false,
            supplier: false,
            distributor: false,
            catalog: false,
            type: false
        })
        // Autocomplete
        const [openFraction, setOpenFraction] = useState('none')
        const [openBtnImportCatalog, setOpenBtnImportCatalog] = useState('none')
        const [openAgency, setOpenAgency] = useState('none')
        const [openDistributerAndCatalog, setOpenDistributerAndCatalog] = useState('none')
        const [urlCatalog, setUrlCatalog] = useState(emptyImg)
        const [idxDistributor, setIdxDistributor] = useState(-1)
        const [IdAgency, setIdAgency] = useState(0)
        const [productName, setProductName] = useState(props.product ? props.product.product : '')
        const [productCode, setProductCode] = useState(props.product ? props.product.code : '')
        const [type, setType] = useState('')
        const [material, setMaterial] = useState('')
        const [fraction, setFraction] = useState(props.product ? props.product.fraction : '')
        const [agency, setAgency] = useState(props.product ? props.product.supplier : '')
        const [distributor, setDistributor] = useState({ title: props.product ? props.product.distributor : '' })
        const [distributorEmail, setDistributorEmail] = useState('')
        const [distributorTel, setDistributorTel] = useState('')
        const [catalog, setCatalog] = useState(0)
        const [catalogName, setCatalogName] = useState('')
        const [imgURL, setImgURL] = useState(props.product ? props.product.image_url : null)
        const [imgCatalog, setImgCatalog] = useState(props.product ? props.product.catalog_image : null)
        const [description, setDescription] = useState(props.product ? props.product.description : '')
        const [note, setNote] = useState(props.product ? props.product.note : '')
        const [size, setSize] = useState(props.product ? props.product.size : '')
        const [invalidImage, setInvalidImage] = useState(null)
        const [invalidImageCat, setInvalidImageCat] = useState(null)
        // const [note, setNote] = useState(emptyImg)
        // ------------------------------
        // input 
        const [openFractionInput, setOpenFractionInput] = useState('none')
        const [openAgencyInput, setOpenAgencyInput] = useState('none')
        const [openDistributerAndCatalogInput, setOpenDistributerAndCatalogInput] = useState('none')
        const [materialInput, setMaterialInput] = useState('')
        const [fractionInput, setFractionInput] = useState('')
        const [agencyInput, setAgencyInput] = useState('')
        const [distributorInput, setDistributorInput] = useState('')
        const [catalogNameInput, setCatalogNameInput] = useState('')
        const [catalogURLInput, setCatalogURLInput] = useState(emptyImg)
        const [distributorTelInput, setDistributorTelInput] = useState('')
        const [distributorMailInput, setDistributorMailInput] = useState('')
        // ------------------------------
        // pending add full
        const [openPending, setOpenPending] = useState('block')
        const [productNamePending, setProductNamePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.product : '')
        const [productCodePending, setProductCodePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.miniProductName : '')
        const [productImagePending, setProductImagePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" && props.objChoose.params.miniProductImage && props.objChoose.params.miniProductImage !== '' ? props.objChoose.params.miniProductImage : emptyImg)
        const [productTypePending, setProductTypePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.group : '')
        const [materialPending, setMaterialPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.material : '')
        const [fractionPending, setFractionPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.fraction : '')
        const [agencyPending, setAgencyPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.agency : '')
        const [distributorNamePending, setDistributorNamePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.distributorName : '')
        const [distributorTelPending, setDistributorTelPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.distributorTel : '')
        const [distributorMailPending, setDistributorMailPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.distributorEmail : '')
        const [catalogNamePending, setCatalogNamePending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" ? props.objChoose.params.catalogName : '')
        const [catalogURLPending, setCatalogURLPending] = useState(props.objChoose && props.objChoose.action === "ADD_FULL_PRODUCT" && props.objChoose.params.catalogImage !== '' ? props.objChoose.params.catalogImage : emptyImg)
        // ------------------------------
        // pending add 
        const [productNameByIdPending, setProductNameByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.params.name : '')
        const [productCodeByIdPending, setProductCodeByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.params.code : '')
        const [productImageByIdPending, setProductImageByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" && props.objChoose.params.imageUrl && props.objChoose.params.imageUrl !== '' ? props.objChoose.params.imageUrl : emptyImg)
        const [productTypeByIdPending, setProductTypeByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.params.type : '')
        const [materialByIdPending, setMaterialByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.material : '')
        const [fractionByIdPending, setFractionByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.fraction : '')
        const [agencyByIdPending, setAgencyByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.supplier : '')
        const [distributorNameByIdPending, setDistributorNameByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.distributors[0].name : '')
        const [distributorTelByIdPending, setDistributorTelByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.distributors[0].tel : '')
        const [distributorMailByIdPending, setDistributorMailByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.distributors[0].email : '')
        const [catalogNameByIdPending, setCatalogNameByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" ? props.objChoose.originalData.catalog_name : '')
        const [catalogURLByIdPending, setCatalogURLByIdPending] = useState(props.objChoose && props.objChoose.action === "ADD_PRODUCT" && props.objChoose.originalData.catalog_image !== '' ? props.objChoose.originalData.catalog_image : emptyImg)
        // ------------------------------
        // auto close on success
        React.useEffect(() => {
            if (props.isSuccessForm === true) {
                props.handleClose()
            }
        }, [props.isSuccessForm]);

        React.useEffect(() => {
            if (props.isSuccessPending === true) {
                props.handleClose()
            }
        }, [props.isSuccessPending]);
        // kiểm tra định dạng email
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        var listMaterial = []
        if (props.listMaterial) {
            props.listMaterial.map((item, idx) => {
                return listMaterial.push({ title: item.name, id: item.id })
            })
        }

        var listCatalogOption = []
        if (props.listCatalog) {
            props.listCatalog.map((item, idx) => {
                return listCatalogOption.push({ title: item.name, id: item.id, url: item.imageUrl })
            })
        }
        // if (props.listAgency) {
        //     var listDistributorOption = []
        //     props.listAgency.map((item, idx) => {
        //         if (item.id === idAgency) {
        //             listDistributorOption.push({ id: item.distributor.idagency_id, title: item.distributor.name })
        //         }
        //     })
        // }
        // console.log("distribiutor    ", distributor);
        var listAgencyOption = []
        if (props.listAgency) {
            props.listAgency.map((item, idx) => {
                return listAgencyOption.push({ id: item.id, title: item.name ? item.name : item.supplier })
            })
        }
        var listFactionOption = []
        if (props.listFaction) {
            props.listFaction.map((item, idx) => {
                return listFactionOption.push({ id: item.id, title: item.name })
            })
        }
        let listDistributorName = []
        let listDistributorEmail = []
        let listDistributorTel = []
        if (props.listDistributor.length > 0) {
            props.listDistributor.map((item, idx) => {
                listDistributorName.push({ id: idx, title: item.name })
                listDistributorEmail.push({ id: idx, title: item.email })
                listDistributorTel.push({ id: idx, title: item.tel })
            })
        }
        const onChangeFile = async (event) => {
            setIsLoadingImage(true)
            setPickedImage(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImage('Vui lòng chọn ảnh!')
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImage('Định dạng ảnh không hỗ trợ!')
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
            } else {
                setImgURL(DOMAIN_IMAGE + res.fileName)
            }
            setInvalidImage(null)
        }

        const onChangeFilePendingById = async (event) => {
            setIsLoadingImage(true)
            setPickedImage(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImage('Vui lòng chọn ảnh!')
                setIsLoadingImage(false)

                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImage('Định dạng ảnh không hỗ trợ!')
                setIsLoadingImage(false)
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
                setIsLoadingImage(false)
            } else {
                setProductImageByIdPending(DOMAIN_IMAGE + res.fileName)
                setIsLoadingImage(false)
            }
            setInvalidImage(null)
        }

        const handleUpdateCatalogPendingById = async (event) => {
            setIsLoadingImageCatalog(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImageCat('Vui lòng chọn ảnh!')
                setIsLoadingImageCatalog(false)
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImageCat('Định dạng ảnh không hỗ trợ!')
                setIsLoadingImageCatalog(false)
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
                setIsLoadingImageCatalog(false)

            } else {
                setCatalogURLByIdPending(DOMAIN_IMAGE + res.fileName)
                setIsLoadingImageCatalog(false)

            }
            setInvalidImageCat(null)
        }

        const onChangeFileCatalog = async (event) => {
            setIsLoadingImageCatalog(true)
            // setPickedImage(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImage('Vui lòng chọn ảnh!')
                setIsLoadingImageCatalog(false)
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImage('Định dạng ảnh không hỗ trợ!')
                setIsLoadingImageCatalog(false)
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
                setIsLoadingImageCatalog(false)
            } else {
                setUrlCatalog(DOMAIN_IMAGE + res.fileName)
                setIsLoadingImageCatalog(false)
            }
            setInvalidImage(null)
        }

        const handleUpdateCatalog = async (event) => {
            setIsLoadingImageCatalog(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImageCat('Vui lòng chọn ảnh!')
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImageCat('Định dạng ảnh không hỗ trợ!')
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
            } else {
                setImgCatalog(DOMAIN_IMAGE + res.fileName)
            }
            setInvalidImageCat(null)
        }
        // pending
        const onChangeFilePending = async (event) => {
            setIsLoadingImage(true)
            setPickedImage(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setIsLoadingImage(false)
                setInvalidImage('Vui lòng chọn ảnh!')
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setIsLoadingImage(false)
                setInvalidImage('Định dạng ảnh không hỗ trợ!')
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                setIsLoadingImage(false)
                alert("Đã xảy ra lỗi khi thêm ảnh!")
            } else {
                setIsLoadingImage(false)
                setProductImagePending(DOMAIN_IMAGE + res.fileName)
            }
            setInvalidImage(null)
        }

        const handleUpdateCatalogPending = async (event) => {
            setIsLoadingImageCatalog(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                setInvalidImageCat('Vui lòng chọn ảnh!')
                setIsLoadingImageCatalog(false)
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                setInvalidImageCat('Định dạng ảnh không hỗ trợ!')
                setIsLoadingImageCatalog(false)
                return false;
            }
            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
                setIsLoadingImageCatalog(false)
            } else {
                setCatalogURLPending(DOMAIN_IMAGE + res.fileName)
                setIsLoadingImageCatalog(false)
            }
            setInvalidImageCat(null)
        }

        return (
            <div>
                {
                    window.location.pathname.match("pending")
                        ?
                        (
                            props.objChoose.action === 'ADD_FULL_PRODUCT'
                                ?
                                <div className="container-add-new-materials">
                                    <DialogTitle className="title-add-new-materials"
                                    >
                                        <label className="title-head">
                                            <Typography variant="h6">Thêm vật liệu mới
                                    </Typography>
                                            <Icon onClick={() => props.handleClose()} path={mdiCloseThick} size={1} />
                                        </label>
                                    </DialogTitle>
                                    <DialogContent className="content-add-new-materials">
                                        <div className="wrap-block-add-new-materials">
                                            <div className="block-input-info"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '60%' }}>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }}>
                                                    <Typography style={{ minWidth: 160 }}>Tên sản phẩm <span id="require-icon">* </span>:</Typography>
                                                    <TextField className="name-product" variant="outlined" size="small"
                                                        defaultValue={productNamePending}
                                                        placeholder="Nhập Tên Sản Phẩm"
                                                        onChange={(e) => { setProductNamePending(e.target.value) }}
                                                    />

                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }}>
                                                    <Typography style={{ minWidth: 160 }}>Mã sản phẩm <span id="require-icon">* </span>:</Typography>
                                                    <TextField className="name-product" variant="outlined" size="small"
                                                        placeholder="Nhập Mã Sản Phẩm"
                                                        defaultValue={productCodePending}
                                                        onChange={(e) => { setProductCodePending(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }}>
                                                    <Typography style={{ minWidth: 160 }}>Loại :</Typography>
                                                    <TextField className="name-product" variant="outlined" size="small"
                                                        placeholder="Nhập Loại Sản Phẩm"
                                                        defaultValue={productTypePending}
                                                        onChange={(e) => { setProductTypePending(e.target.value) }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }} > Vật liệu <span id="require-icon">* </span>:</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listMaterial}
                                                        getOptionLabel={(option) => option.title}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}

                                                        value={{ title: materialPending }}
                                                        renderInput={
                                                            (params) =>
                                                                <TextField {...params} placeholder="Chọn Vật Liệu" variant="outlined"
                                                                    onChange={(e) => {
                                                                        setMaterialPending(e.target.value)
                                                                        if (e.target.value !== '') {
                                                                            setChooseFraction(false)
                                                                            setOpenFraction("block")
                                                                            props.getFractionAll();
                                                                        }
                                                                        if (e.target.value === '') {
                                                                            setOpenFraction("none")
                                                                            props.getMaterial()
                                                                        } else {
                                                                            if (listMaterial.length > 0) {
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
                                                                setOpenDistributerAndCatalog("none")
                                                                setOpenAgency("none")
                                                                setOpenFractionInput('none')
                                                                setOpenAgencyInput('none')
                                                                setOpenDistributerAndCatalogInput('none')
                                                                setMaterial('')
                                                                setAgency('')
                                                                setFraction('')
                                                                setDistributor('')
                                                                setDistributorEmail('')
                                                                setDistributorTel('')
                                                                setCatalogName('')
                                                                setCatalog(0)
                                                                setAgencyInput('')
                                                                setDistributorInput('')
                                                                setDistributorMailInput('')
                                                                setFractionInput('')
                                                                setDistributorTelInput('')
                                                                setCatalogNameInput('')
                                                                setCatalogURLInput(emptyImg)
                                                            } else {
                                                                setOpenFraction("block")
                                                                setOpenFractionInput('none')
                                                                setOpenAgencyInput('none')
                                                                setOpenDistributerAndCatalogInput('none')
                                                                props.getFraction(value.id)
                                                                setMaterialPending(value.title)
                                                                setChooseFraction(true)
                                                                setMaterialInput('')
                                                                setFraction('')
                                                                setAgency('')
                                                                setCatalogName('')
                                                                setDistributor('')
                                                                setUrlCatalog(emptyImg)
                                                                setAgencyInput('')
                                                                setDistributorInput('')
                                                                setDistributorMailInput('')
                                                                setFractionInput('')
                                                                setDistributorTelInput('')
                                                                setCatalogNameInput('')
                                                                setCatalogURLInput(emptyImg)
                                                            }
                                                        }}
                                                        onFocus={(e, value) => {
                                                            props.getMaterial(1);
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }}>
                                                    <Typography style={{ minWidth: 160 }}>Phân khúc <span id="require-icon">* </span>:</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        value={{ title: fractionPending }}
                                                        options={listFactionOption}
                                                        getOptionLabel={(option) => option.title}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={(params) => <TextField {...params} placeholder="Chọn Phân Khúc" variant="outlined"
                                                            onChange={(e) => {
                                                            }}
                                                        />}
                                                        onFocus={() => {

                                                            props.getCatalogAll()
                                                            props.getAgencyAll()
                                                        }}
                                                        onChange={(e, value) => {
                                                            if (!value) {
                                                                setOpenAgency("none")
                                                                setOpenDistributerAndCatalog("none")
                                                                setFraction('')
                                                                setDistributor('')
                                                                setAgency('')
                                                                setCatalogName('')
                                                                setCatalog(0)
                                                            } else {
                                                                setOpenAgency("block")
                                                                if (chooseFraction === true) {
                                                                    props.getAgency(value.id)
                                                                }
                                                                setFractionPending(value.title)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }}>Nhà cung cấp :</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listAgencyOption}
                                                        getOptionLabel={(option) => option.title}
                                                        value={{ title: agencyPending }}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={(params) =>
                                                            <TextField {...params} placeholder="Chọn Nhà Cung Cấp" variant="outlined"
                                                                onChange={(e) => {
                                                                    if (e.target.value === '') {
                                                                        setOpenDistributerAndCatalog("none")
                                                                    } else {
                                                                        props.getAgencySearch(e.target.value)
                                                                        setAgencyPending(e.target.value)
                                                                        setOpenDistributerAndCatalog("block")
                                                                    }
                                                                }}
                                                            />}
                                                        onChange={(e, value) => {
                                                            if (!value) {
                                                                setOpenDistributerAndCatalog("none")
                                                                setAgencyPending('')
                                                                setDistributor('')
                                                                setCatalogName('')
                                                                setCatalog(0)
                                                            } else {
                                                                setOpenDistributerAndCatalog("block")
                                                                setIdAgency(value.id)
                                                                setAgencyPending(value.title)
                                                                if (chooseFraction === true) {
                                                                    props.getCatalog(value.id)
                                                                } else {
                                                                    props.getCatalogAll()
                                                                }
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            props.getDistributorAll(agency)
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }}>Nhà phân phối :</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listDistributorName}
                                                        getOptionLabel={(option) => option.title}
                                                        value={{ title: distributorNamePending }}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={(params) => <TextField {...params} placeholder="Chọn Tên Nhà Phân Phối" variant="outlined"
                                                            onChange={(e) => {
                                                                setDistributorNamePending(e.target.value)
                                                            }}
                                                        />}
                                                        onChange={(e, value) => {
                                                            if (value) {
                                                                setDistributorNamePending(value.title)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }}>Email NPP :</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listDistributorEmail}
                                                        getOptionLabel={(option) => option.title}
                                                        value={{ title: distributorMailPending }}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={(params) => <TextField {...params} placeholder="Chọn Email Nhà Phân Phối" variant="outlined"
                                                            onChange={(e) => {
                                                                if (e.target.value === '') {
                                                                } else {
                                                                    setDistributorMailPending(e.target.value)
                                                                }
                                                            }}
                                                        />}
                                                        onChange={(e, value) => {
                                                            if (!value) {
                                                            } else {
                                                                setDistributorMailPending(value.title)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }}>Tel NPP :</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listDistributorTel}
                                                        getOptionLabel={(option) => option.title}
                                                        value={{ title: distributorTelPending }}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={(params) => <TextField {...params} placeholder="Chọn Tel Nhà Phân Phối" variant="outlined"
                                                            onChange={(e) => {
                                                                if (e.target.value === '') {
                                                                } else {
                                                                    setDistributorTelPending(e.target.value)
                                                                }
                                                            }}
                                                        />}
                                                        onChange={(e, value) => {
                                                            if (!value) {
                                                            } else {
                                                                setDistributorTelPending(value.title)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-input"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '100%', display: "flex", alignItems: "center" }} >
                                                    <Typography style={{ minWidth: 160 }}>Quyển <span id="require-icon">* </span>:</Typography>
                                                    <Autocomplete
                                                        className="input-filter"
                                                        size="small"
                                                        options={listCatalogOption}
                                                        value={{ title: catalogNamePending }}
                                                        getOptionLabel={(option) => option.title}
                                                        style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                        renderInput={
                                                            (params) =>
                                                                <TextField {...params} placeholder="Chọn Quyển" variant="outlined"
                                                                    onChange={(e, value) => {
                                                                        if (e.target.value !== '') {
                                                                            setCatalogNamePending(e.target.value)
                                                                            setOpenBtnImportCatalog('inline-flex')
                                                                            props.getCatalogSearch(e.target.value)
                                                                        } else {
                                                                            props.getCatalogAll()
                                                                            setCatalogNamePending('')
                                                                            setOpenBtnImportCatalog('none')
                                                                        }
                                                                    }}
                                                                />
                                                        }
                                                        onChange={(e, value) => {
                                                            if (!value) {
                                                                setUrlCatalog(emptyImg)
                                                                setCatalogNamePending('')
                                                                setOpenBtnImportCatalog('none')
                                                            } else {
                                                                setCatalogURLPending(value.url)
                                                                setCatalog(value.id)
                                                                setOpenBtnImportCatalog('none')
                                                                setCatalogNamePending(value.title)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="block-img">
                                                <div className="block-add-img">
                                                    <div className="block-add-img-head" style={{ display: "flex", flexDirection: "column" }}>
                                                        <div>
                                                            <Typography>Ảnh sản phẩm</Typography>
                                                        </div>
                                                        <div className="block-add-img-show-img">
                                                            <Button
                                                                variant="contained"
                                                                component="label"
                                                                style={{ marginLeft: "37%" }}
                                                            >
                                                                <Icon path={mdiUpload} size={1} />
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    onChange={(e) => onChangeFilePending(e)}
                                                                />
                                                            </Button>
                                                            {
                                                                isLoadingImage
                                                                    ?
                                                                    <img
                                                                        src={loadImg}
                                                                        className="img-product-new"
                                                                        style={{ height: '300', display: "block" }}
                                                                    />
                                                                    :
                                                                    <img src={productImagePending} className="img-product-new"
                                                                        style={{ height: '300' }}
                                                                    />
                                                            }

                                                        </div>
                                                    </div>
                                                    {/* <div className="block-add-img-show-img">
                                                        {isPickedImage
                                                            ?
                                                            <>
                                                                {isLoadingImage && <img className="img-product-new" src={"https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif"} />}

                                                                <img style={isLoadingImage ? { display: "none" } : { display: "block" }} className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={imgURL} />
                                                            </>
                                                            :
                                                            <img src={imgUrlPreview} />
                                                        }
                                                    </div> */}
                                                </div>
                                                <div className="block-add-img">

                                                    <div className="block-add-img-show-img">
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                            style={{ display: openBtnImportCatalog, marginLeft: "37%" }}
                                                        >
                                                            <Icon path={mdiUpload} size={1} />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={(e) => handleUpdateCatalogPending(e)}
                                                            />
                                                        </Button>

                                                        {
                                                            isLoadingImageCatalog
                                                                ?
                                                                <img
                                                                    src={loadImg}
                                                                    className="img-product-new"
                                                                    style={{ height: '300', display: "block" }}
                                                                />
                                                                :
                                                                <img src={catalogURLPending} className="img-product-new"
                                                                    style={{ height: '300' }}
                                                                />
                                                        }

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </DialogContent>
                                    <div style={
                                        window.innerWidth <= 500
                                            ?
                                            {
                                                display: "flex",
                                                justifyContent: "center",
                                                flexDirection: "column-reverse"
                                            }
                                            :
                                            {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                        <span style={
                                            window.innerWidth <= 500
                                                ?
                                                {
                                                    fontSize: 12, margin: "auto",
                                                    paddingBottom: 5
                                                }
                                                :
                                                {
                                                    fontSize: 12, marginLeft: "4%"
                                                }}>Những trường hợp có  <span style={{ color: "red" }}>*</span> bắt buộc nhập</span>
                                        <DialogActions className="actions-add-new-materials" style={window.innerWidth <= 500
                                            ?
                                            {
                                                margin: "auto"
                                            }
                                            :
                                            {
                                                marginRight: 50, padding: 7
                                            }}>
                                            {
                                                props.objChoose && props.objChoose.status === 'PENDING' && JSON.parse(localStorage.getItem("UI")).isAdmin === 1
                                                    ?
                                                    <Button className="btn-quick-creation" variant="contained"
                                                        onClick={() => {
                                                            if (validateEmail(distributorMailPending) === false && distributorMailPending !== "") {
                                                                alert("Vui lòng nhập đúng định dạng Email")
                                                            } else {
                                                                if (productCodePending !== '' && productNamePending !== '' && catalogNamePending !== ''
                                                                    && materialPending !== '' && fractionPending !== '') {
                                                                    props.postProductInput({
                                                                        id: props.objChoose.id,
                                                                        accept: true,
                                                                        productName: productNamePending,
                                                                        productCode: productCodePending,
                                                                        type: productTypePending === '' ? "Chưa phân loại" : productTypePending,
                                                                        material: materialPending,
                                                                        fraction: fractionPending,
                                                                        agnecy: agencyPending === '' ? "Chưa nhập" : agencyPending,
                                                                        distributorName: distributorNamePending === '' ? "Chưa nhập" : distributorNamePending,
                                                                        distributorTel: distributorTelPending === '' ? "Chưa nhập" : distributorTelPending,
                                                                        distributorMail: distributorMailPending === '' ? "Chưanhập@gmail.com" : distributorMailPending,
                                                                        catalogName: catalogNamePending,
                                                                        catalogURL: catalogURLPending === emptyImg ? '' : catalogURLPending,
                                                                        imageURL: productImagePending === emptyImg ? '' : productImagePending
                                                                    })
                                                                } else {
                                                                    alert('Mời nhập thông tin đầy đủ')
                                                                }
                                                            }
                                                        }
                                                        }
                                                    > Phê duyệt</Button>
                                                    :
                                                    <></>
                                            }

                                            {props.objChoose && props.objChoose.status === 'PENDING' && JSON.parse(localStorage.getItem("UI")).isAdmin === 1
                                                ?
                                                <Button variant="contained" color="secondary" onClick={() => props.putStatusPending({
                                                    id: props.objChoose.id,
                                                    accept: false
                                                })} >Từ Chối</Button>
                                                :
                                                <Button variant="contained" color="secondary" onClick={() => props.handleClose()} >Hủy</Button>
                                            }
                                        </DialogActions>
                                    </div>

                                </div>
                                :
                                (
                                    <div className="container-add-new-materials">
                                        <DialogTitle className="title-add-new-materials"
                                        >
                                            <label className="title-head">
                                                <Typography variant="h6">Thêm vật liệu mới
                                    </Typography>
                                                <Icon onClick={() => props.handleClose()} path={mdiCloseThick} size={1} />
                                            </label>
                                        </DialogTitle>
                                        <DialogContent className="content-add-new-materials">
                                            <div className="wrap-block-add-new-materials">
                                                <div className="block-input-info"
                                                    style={window.innerWidth <= 500
                                                        ?
                                                        { width: '100%' }
                                                        :
                                                        { width: '60%' }}>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }}>
                                                        <Typography style={{ minWidth: 160 }}>Tên sản phẩm <span id="require-icon">* </span>:</Typography>
                                                        <TextField className="name-product" variant="outlined" size="small"
                                                            defaultValue={productNameByIdPending}
                                                            placeholder="Nhập Tên Sản Phẩm"
                                                            onChange={(e) => { setProductNameByIdPending(e.target.value) }}
                                                        />

                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }}>
                                                        <Typography style={{ minWidth: 160 }}>Mã sản phẩm <span id="require-icon">* </span>:</Typography>
                                                        <TextField className="name-product" variant="outlined" size="small"
                                                            placeholder="Nhập Mã Sản Phẩm"
                                                            defaultValue={productCodeByIdPending}
                                                            onChange={(e) => { setProductCodeByIdPending(e.target.value) }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }}>
                                                        <Typography style={{ minWidth: 160 }}>Loại :</Typography>
                                                        <TextField className="name-product" variant="outlined" size="small"
                                                            placeholder="Nhập Loại Sản Phẩm"
                                                            defaultValue={productTypeByIdPending}
                                                            onChange={(e) => { setProductTypeByIdPending(e.target.value) }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }} >
                                                        <Typography style={{ minWidth: 160 }}>Vật liệu <span id="require-icon">* </span>:</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listMaterial}
                                                            getOptionLabel={(option) => option.title}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            value={{ title: materialByIdPending }}
                                                            renderInput={
                                                                (params) =>
                                                                    <TextField {...params} placeholder="Chọn Vật Liệu" variant="outlined"
                                                                        onChange={(e) => {
                                                                            setMaterialByIdPending(e.target.value)
                                                                            if (e.target.value !== '') {
                                                                                setChooseFraction(false)
                                                                                setOpenFraction("block")
                                                                                props.getFractionAll();
                                                                            }
                                                                            if (e.target.value === '') {
                                                                                setOpenFraction("none")
                                                                                props.getMaterial()
                                                                            } else {
                                                                                if (listMaterial.length > 0) {
                                                                                    props.getMaterialSearch(e.target.value)
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                            }
                                                            onChange={(e, value) => {
                                                                if (!e.target.value) {
                                                                    props.getMaterial(1)
                                                                    setMaterialByIdPending('')
                                                                }
                                                                if (!value) {
                                                                    setOpenFraction("none")
                                                                    setOpenDistributerAndCatalog("none")
                                                                    setOpenAgency("none")
                                                                    setOpenFractionInput('none')
                                                                    setOpenAgencyInput('none')
                                                                    setOpenDistributerAndCatalogInput('none')
                                                                    setMaterial('')
                                                                    setAgency('')
                                                                    setFraction('')
                                                                    setDistributor('')
                                                                    setDistributorEmail('')
                                                                    setDistributorTel('')
                                                                    setCatalogName('')
                                                                    setCatalog(0)
                                                                    setAgencyInput('')
                                                                    setDistributorInput('')
                                                                    setDistributorMailInput('')
                                                                    setFractionInput('')
                                                                    setDistributorTelInput('')
                                                                    setCatalogNameInput('')
                                                                    setCatalogURLInput(emptyImg)
                                                                } else {
                                                                    setOpenFraction("block")
                                                                    setOpenFractionInput('none')
                                                                    setOpenAgencyInput('none')
                                                                    setOpenDistributerAndCatalogInput('none')
                                                                    props.getFraction(value.id)
                                                                    setMaterialByIdPending(value.title)
                                                                    setChooseFraction(true)
                                                                    setMaterialInput('')
                                                                    setFraction('')
                                                                    setAgency('')
                                                                    setCatalogName('')
                                                                    setDistributor('')
                                                                    setUrlCatalog(emptyImg)
                                                                    setAgencyInput('')
                                                                    setDistributorInput('')
                                                                    setDistributorMailInput('')
                                                                    setFractionInput('')
                                                                    setDistributorTelInput('')
                                                                    setCatalogNameInput('')
                                                                    setCatalogURLInput(emptyImg)
                                                                }
                                                            }}
                                                            onFocus={(e, value) => {
                                                                props.getMaterial(1);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }}>
                                                        <Typography style={{ minWidth: 160 }}>Phân khúc <span id="require-icon">* </span>:</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            value={{ title: fractionByIdPending }}
                                                            options={listFactionOption}
                                                            getOptionLabel={(option) => option.title}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={(params) => <TextField {...params} placeholder="Chọn Phân Khúc" variant="outlined"
                                                                onChange={(e) => {
                                                                }}
                                                            />}
                                                            onFocus={() => {

                                                                props.getCatalogAll()
                                                                props.getAgencyAll()
                                                            }}
                                                            onChange={(e, value) => {
                                                                if (!value) {
                                                                    setOpenAgency("none")
                                                                    setOpenDistributerAndCatalog("none")
                                                                    setFraction('')
                                                                    setDistributor('')
                                                                    setAgency('')
                                                                    setCatalogName('')
                                                                    setCatalog(0)
                                                                    setFractionByIdPending('')
                                                                } else {
                                                                    setOpenAgency("block")
                                                                    if (chooseFraction === true) {
                                                                        props.getAgency(value.id)
                                                                    }
                                                                    setFractionByIdPending(value.title)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }}>
                                                        <Typography style={{ minWidth: 160 }}>Nhà cung cấp :</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listAgencyOption}
                                                            getOptionLabel={(option) => option.title}
                                                            value={{ title: agencyByIdPending }}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={(params) =>
                                                                <TextField {...params} placeholder="Chọn Nhà Cung Cấp" variant="outlined"
                                                                    onChange={(e) => {
                                                                        if (e.target.value === '') {
                                                                            setAgencyByIdPending('')
                                                                        } else {
                                                                            props.getAgencySearch(e.target.value)
                                                                            setAgencyByIdPending(e.target.value)
                                                                        }
                                                                    }}
                                                                />}
                                                            onChange={(e, value) => {
                                                                if (!value) {
                                                                    setAgencyPending('')
                                                                    setDistributor('')
                                                                    setCatalogName('')
                                                                    setCatalog(0)
                                                                    setAgencyByIdPending('')
                                                                } else {
                                                                    setOpenDistributerAndCatalog("block")
                                                                    setIdAgency(value.id)
                                                                    setAgencyByIdPending(value.title)
                                                                    if (chooseFraction === true) {
                                                                        props.getCatalog(value.id)
                                                                    } else {
                                                                        props.getCatalogAll()
                                                                    }
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                props.getDistributorAll(agency)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }} >
                                                        <Typography style={{ minWidth: 160 }}>Nhà phân phối :</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listDistributorName}
                                                            getOptionLabel={(option) => option.title}
                                                            value={{ title: distributorNameByIdPending }}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={(params) => <TextField {...params} placeholder="Chọn Tên Nhà Phân Phối" variant="outlined"
                                                                onChange={(e) => {
                                                                    setDistributorNameByIdPending(e.target.value)
                                                                }}
                                                            />}
                                                            onChange={(e, value) => {
                                                                if (value) {
                                                                    setDistributorNameByIdPending(value.title)
                                                                } else {
                                                                    setDistributorNameByIdPending('')
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }} >
                                                        <Typography style={{ minWidth: 160 }}>Email NPP :</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listDistributorEmail}
                                                            getOptionLabel={(option) => option.title}
                                                            value={{ title: distributorMailByIdPending }}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={(params) => <TextField {...params} placeholder="Chọn Email Nhà Phân Phối" variant="outlined"
                                                                onChange={(e) => {
                                                                    if (e.target.value === '') {
                                                                        setDistributorMailByIdPending('')
                                                                    } else {
                                                                        setDistributorMailByIdPending(e.target.value)
                                                                    }
                                                                }}
                                                            />}
                                                            onChange={(e, value) => {
                                                                if (!value) {
                                                                    setDistributorMailByIdPending('')
                                                                } else {
                                                                    setDistributorMailByIdPending(value.title)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }} >
                                                        <Typography style={{ minWidth: 160 }}>Tel NPP :</Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listDistributorTel}
                                                            getOptionLabel={(option) => option.title}
                                                            value={{ title: distributorTelByIdPending }}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={(params) => <TextField {...params} placeholder="Chọn Tel Nhà Phân Phối" variant="outlined"
                                                                onChange={(e) => {
                                                                    if (e.target.value === '') {
                                                                        setDistributorTelByIdPending('')
                                                                    } else {
                                                                        setDistributorTelByIdPending(e.target.value)
                                                                    }
                                                                }}
                                                            />}
                                                            onChange={(e, value) => {
                                                                if (!value) {
                                                                    setDistributorTelByIdPending('')
                                                                } else {
                                                                    setDistributorTelByIdPending(value.title)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-input"
                                                        style={window.innerWidth <= 500
                                                            ?
                                                            { width: '100%' }
                                                            :
                                                            { width: '100%', display: "flex", alignItems: "center" }} >
                                                        <Typography style={{ minWidth: 160 }}>Quyển <span id="require-icon" style={{ color: "red" }}>*</span></Typography>
                                                        <Autocomplete
                                                            className="input-filter"
                                                            size="small"
                                                            options={listCatalogOption}
                                                            value={{ title: catalogNameByIdPending }}
                                                            getOptionLabel={(option) => option.title}
                                                            style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                            renderInput={
                                                                (params) =>
                                                                    <TextField {...params} placeholder="Chọn Quyển" variant="outlined"
                                                                        onChange={(e, value) => {
                                                                            if (e.target.value !== '') {
                                                                                setCatalogNameByIdPending(e.target.value)
                                                                                setOpenBtnImportCatalog('inline-flex')
                                                                                props.getCatalogSearch(e.target.value)
                                                                            } else {
                                                                                setCatalogNameByIdPending('')
                                                                                props.getCatalogAll()
                                                                                setCatalogNameByIdPending('')
                                                                                setOpenBtnImportCatalog('none')
                                                                            }
                                                                        }}
                                                                    />
                                                            }
                                                            onChange={(e, value) => {
                                                                if (!value) {
                                                                    setUrlCatalog(emptyImg)
                                                                    setCatalogNameByIdPending('')
                                                                    setCatalogURLByIdPending(emptyImg)
                                                                    setOpenBtnImportCatalog('none')
                                                                } else {
                                                                    setCatalogURLByIdPending(value.url)
                                                                    setCatalog(value.id)
                                                                    setCatalogNameByIdPending(value.title)
                                                                    setOpenBtnImportCatalog('none')
                                                                }
                                                            }}
                                                        />
                                                    </div>

                                                </div>



                                                <div className="block-img">
                                                    <div className="block-add-img">
                                                        <div className="block-add-img-head" style={{
                                                            display: "flex"
                                                            // , flexDirection: "column" 
                                                        }}>
                                                            <div>
                                                                <Typography style={{ marginRight: 15 }}>Ảnh sản phẩm</Typography>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginRight: 20
                                                            }}>
                                                                {invalidImage && <span style={{ color: "red" }}>{invalidImage}</span>}
                                                                <Button
                                                                    variant="contained"
                                                                    component="label"
                                                                >
                                                                    {/* Upload File */}
                                                                    <Icon path={mdiUpload} size={1} />
                                                                    <input
                                                                        type="file"
                                                                        hidden
                                                                        onChange={(e) => onChangeFilePendingById(e)}
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="block-add-img-show-img">
                                                            {isPickedImage
                                                                ?
                                                                <>
                                                                    {isLoadingImage && <img className="img-product-new" src={"https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif"} />}

                                                                    <img style={isLoadingImage ? { display: "none" } : { display: "block" }} className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={productImageByIdPending} />
                                                                </>
                                                                :
                                                                <img src={productImageByIdPending} className="img-product-new" />
                                                            }
                                                            {/* <img className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={(isLoadingImage) ? "https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif" : imgUrl} /> */}
                                                            {/* <img src={imgURL ? imgURL : imgUrlPreview} className="img-product-new" /> */}
                                                        </div>
                                                    </div>
                                                    <div className="block-add-img"
                                                    //  style={{ display: openDistributerAndCatalog }}
                                                    >

                                                        <div className="block-add-img-show-img">
                                                            <Button
                                                                variant="contained"
                                                                component="label"
                                                                style={{
                                                                    display: openBtnImportCatalog, marginLeft: "35%", marginTop: -12
                                                                }}
                                                            >
                                                                <Icon path={mdiUpload} size={1} />
                                                                <input
                                                                    type="file"
                                                                    hidden
                                                                    onChange={(e) => handleUpdateCatalogPendingById(e)}
                                                                />
                                                            </Button>
                                                            {
                                                                isLoadingImageCatalog
                                                                    ?
                                                                    <img
                                                                        src={loadImg}
                                                                        className="img-product-new"
                                                                        style={{ height: '300', display: "block" }}
                                                                    />
                                                                    :
                                                                    <img
                                                                        src={catalogURLByIdPending} className="img-product-new"
                                                                        onLoad={() => setIsLoadingImageCatalog(false)}
                                                                        onError={() => setIsLoadingImageCatalog(false)}
                                                                        style={{ height: '300', display: "block" }}
                                                                    />
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                        <div style={
                                            window.innerWidth <= 500
                                                ?
                                                {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    flexDirection: "column-reverse"
                                                }
                                                :
                                                {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                            <span style={
                                                window.innerWidth <= 500
                                                    ?
                                                    {
                                                        fontSize: 12, margin: "auto",
                                                        paddingBottom: 5
                                                    }
                                                    :
                                                    {
                                                        fontSize: 12, marginLeft: "4%"
                                                    }}>Những trường hợp có  <span style={{ color: "red" }}>*</span> bắt buộc nhập</span>
                                            <DialogActions className="actions-add-new-materials"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    {
                                                        margin: "auto"
                                                    }
                                                    :
                                                    {
                                                        marginRight: 50
                                                    }}
                                            >
                                                {
                                                    props.objChoose && props.objChoose.status === 'PENDING' && JSON.parse(localStorage.getItem("UI")).isAdmin === 1
                                                        ?
                                                        <Button className="btn-quick-creation" variant="contained"
                                                            onClick={() => {
                                                                if (validateEmail(distributorMailByIdPending) === false && distributorMailByIdPending !== "") {
                                                                    alert("Vui lòng nhập đúng định dạng Email")
                                                                } else {
                                                                    if (productCodeByIdPending !== '' && productNameByIdPending !== ''
                                                                        && catalogNameByIdPending !== '' && materialByIdPending !== '' && fractionByIdPending !== '') {
                                                                        props.postProductInput({
                                                                            id: props.objChoose.id,
                                                                            accept: true,
                                                                            productName: productNameByIdPending,
                                                                            productCode: productCodeByIdPending,
                                                                            type: productTypeByIdPending === '' ? "Chưa phân loại" : productTypeByIdPending,
                                                                            material: materialByIdPending,
                                                                            fraction: fractionByIdPending,
                                                                            agnecy: agencyByIdPending === '' ? "Chưa nhập" : agencyByIdPending,
                                                                            distributorName: distributorNameByIdPending === '' ? "Chưa nhập" : distributorNameByIdPending,
                                                                            distributorTel: distributorTelByIdPending === '' ? "Chưa nhập" : distributorTelByIdPending,
                                                                            distributorMail: distributorMailByIdPending === '' ? "Chưanhập@gmail.com" : distributorMailByIdPending,
                                                                            catalogName: catalogNameByIdPending,
                                                                            catalogURL: catalogURLByIdPending === emptyImg ? '' : catalogURLByIdPending,
                                                                            imageURL: productImageByIdPending === emptyImg ? '' : productImageByIdPending
                                                                        })
                                                                    } else {
                                                                        alert('Mời nhập thông tin đầy đủ')
                                                                    }
                                                                }
                                                            }}

                                                        > Phê duyệt </Button>
                                                        :
                                                        <></>
                                                }

                                                {props.objChoose && props.objChoose.status === 'PENDING' && JSON.parse(localStorage.getItem("UI")).isAdmin === 1
                                                    ?
                                                    <Button variant="contained" color="secondary" onClick={() => props.putStatusPending({
                                                        id: props.objChoose.id,
                                                        accept: false
                                                    })} >Từ Chối</Button>
                                                    :
                                                    <Button variant="contained" color="secondary" onClick={() => props.handleClose()} >Hủy</Button>
                                                }
                                            </DialogActions>
                                        </div>

                                    </div>
                                )
                        )
                        :
                        (props.type === "add"
                            ?
                            <div className="container-add-new-materials">
                                <DialogTitle className="title-add-new-materials"
                                >
                                    <label className="title-head">
                                        <Typography variant="h6">Thêm vật liệu mới
                                    </Typography>
                                        <Icon onClick={() => props.handleClose()} path={mdiCloseThick} size={1} />
                                    </label>
                                </DialogTitle>
                                <DialogContent className="content-add-new-materials" >
                                    <div className="wrap-block-add-new-materials">
                                        <div className="block-input-info"
                                            // style={(window.innerWidth > 500) && { width: '60%' }}
                                            style={window.innerWidth <= 500
                                                ?
                                                { width: '100%' }
                                                :
                                                { width: '60%' }}
                                        >
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Tên sản phẩm <span id="require-icon">* </span>:</Typography>
                                                <TextField className="name-product" variant="outlined" size="small"
                                                    placeholder="Nhập Tên Sản Phẩm"
                                                    onChange={(e) => { setProductName(e.target.value) }}
                                                />

                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Mã sản phẩm <span id="require-icon">* </span>:</Typography>
                                                <TextField className="name-product" variant="outlined" size="small"
                                                    placeholder="Nhập Mã Sản Phẩm"
                                                    onChange={(e) => { setProductCode(e.target.value) }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Loại :</Typography>
                                                <TextField className="name-product" variant="outlined" size="small"
                                                    placeholder="Nhập Loại Sản Phẩm"
                                                    onChange={(e) => { setType(e.target.value) }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}>
                                                <Typography style={{ minWidth: 160 }}>Vật liệu <span id="require-icon">* </span>:</Typography>
                                                <Autocomplete
                                                    disabled={disabled}
                                                    className="input-filter"
                                                    size="small"
                                                    options={listMaterial}
                                                    getOptionLabel={(option) => option.title}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    value={{ title: materialInput ? materialInput : material }}
                                                    renderInput={
                                                        (params) =>
                                                            <TextField {...params} placeholder="Chọn Vật Liệu" variant="outlined"
                                                                onChange={(e) => {
                                                                    setMaterial(e.target.value)
                                                                    if (e.target.value !== '') {
                                                                        setChooseFraction(false)
                                                                        if (JSON.parse(localStorage.getItem("UI")).viewFraction === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1 && material !== '') {
                                                                            props.getFractionAll();
                                                                        }
                                                                    }
                                                                    if (e.target.value === '') {
                                                                        if (JSON.parse(localStorage.getItem("UI")).viewMaterial === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                            props.getMaterial()
                                                                        }
                                                                    } else {
                                                                        if (listMaterial.length > 0) {
                                                                            if (JSON.parse(localStorage.getItem("UI")).viewMaterial === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                                props.getMaterialSearch(e.target.value)
                                                                            }
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
                                                            setOpenDistributerAndCatalog("none")
                                                            setOpenAgency("none")
                                                            setOpenFractionInput('none')
                                                            setOpenAgencyInput('none')
                                                            setOpenDistributerAndCatalogInput('none')
                                                            setMaterial('')
                                                            setAgency('')
                                                            setFraction('')
                                                            setDistributor('')
                                                            setDistributorEmail('')
                                                            setChooseFraction(false)
                                                            setDistributorTel('')
                                                            setCatalogName('')
                                                            setCatalog(0)
                                                            setAgencyInput('')
                                                            setDistributorInput('')
                                                            setDistributorMailInput('')
                                                            setFractionInput('')
                                                            setDistributorTelInput('')
                                                            setCatalogNameInput('')
                                                            setCatalogURLInput(emptyImg)
                                                        } else {
                                                            setOpenFraction("block")
                                                            setOpenFractionInput('none')
                                                            setOpenAgencyInput('none')
                                                            setOpenDistributerAndCatalogInput('none')
                                                            if (JSON.parse(localStorage.getItem("UI")).viewFraction === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                props.getFraction(value.id)
                                                            }
                                                            setMaterial(value.title)
                                                            setChooseFraction(true)
                                                            setMaterialInput('')
                                                            setFraction('')
                                                            setAgency('')
                                                            setCatalogName('')
                                                            setDistributor('')
                                                            setUrlCatalog(emptyImg)
                                                            setAgencyInput('')
                                                            setDistributorInput('')
                                                            setDistributorMailInput('')
                                                            setFractionInput('')
                                                            setDistributorTelInput('')
                                                            setCatalogNameInput('')
                                                            setCatalogURLInput(emptyImg)
                                                        }
                                                    }}
                                                    onFocus={(e, value) => {
                                                        if (JSON.parse(localStorage.getItem("UI")).viewMaterial === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                            props.getMaterial(1);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            // style={{ display: openFraction }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Phân khúc <span id="require-icon">* </span>:</Typography>
                                                <Autocomplete
                                                    disabled={disabled}
                                                    className="input-filter"
                                                    size="small"
                                                    value={{ title: fraction }}
                                                    options={listFactionOption}
                                                    getOptionLabel={(option) => option.title}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={(params) => <TextField {...params} placeholder="Chọn Phân Khúc" variant="outlined"
                                                        onChange={(e) => {
                                                        }}
                                                    />}
                                                    onFocus={() => {
                                                        // if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                        //     props.getCatalogAll()
                                                        // }
                                                        if (JSON.parse(localStorage.getItem("UI")).viewAgency === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1 && material !== '' && fraction !== '') {
                                                            props.getAgencyAll()
                                                        }
                                                    }}
                                                    onChange={(e, value) => {
                                                        if (!value) {
                                                            setOpenAgency("none")
                                                            setOpenDistributerAndCatalog("none")
                                                            setFraction('')
                                                            setDistributor('')
                                                            setAgency('')
                                                            setCatalogName('')
                                                            setCatalog(0)
                                                        } else {
                                                            setOpenAgency("block")
                                                            setFraction(value.title)
                                                            if (chooseFraction === true) {
                                                                if (JSON.parse(localStorage.getItem("UI")).viewAgency === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1 && material !== '') {
                                                                    props.getAgency(value.id)
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            // style={{ display: openAgency }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Nhà cung cấp :</Typography>
                                                <Autocomplete
                                                    className="input-filter"
                                                    disabled={disabled}
                                                    size="small"
                                                    options={listAgencyOption}
                                                    getOptionLabel={(option) => option.title}
                                                    value={{ title: agency }}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={(params) =>
                                                        <TextField {...params} placeholder="Chọn Nhà Cung Cấp" variant="outlined"
                                                            onChange={(e) => {
                                                                if (e.target.value === '') {
                                                                    setOpenDistributerAndCatalog("none")
                                                                    setChooseFraction(false)
                                                                    // props.getAgencyForcus()
                                                                } else {
                                                                    // props.getAgency(e.target.value)
                                                                    if (JSON.parse(localStorage.getItem("UI")).viewAgency === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1 && material !== '' && fraction !== '') {
                                                                        props.getAgencySearch(e.target.value)
                                                                    }
                                                                    if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                        props.getCatalogAll()
                                                                    }
                                                                }
                                                                setAgency(e.target.value)
                                                            }}
                                                        />}
                                                    onChange={(e, value) => {
                                                        // if (!e.target.value) {
                                                        //     props.getAgencyForcus()
                                                        // }
                                                        if (!value) {
                                                            setAgency('')
                                                            setDistributor('')
                                                            setChooseFraction(false)
                                                            setCatalogName('')
                                                            setCatalog(0)
                                                        } else {
                                                            // props.getDistributor(value.title)
                                                            setIdAgency(value.id)
                                                            setAgency(value.title)
                                                            if (chooseFraction === true) {
                                                                if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                    props.getCatalog(value.id)
                                                                }
                                                            } else {
                                                                if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                    props.getCatalogAll()
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        if (JSON.parse(localStorage.getItem("UI")).editDistributor === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                            props.getDistributorAll(agency)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                //  style={{ display: openDistributerAndCatalog }} 
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Nhà phân phối :</Typography>
                                                <Autocomplete
                                                    className="input-filter"
                                                    disabled={disabled}
                                                    size="small"
                                                    options={listDistributorName}
                                                    getOptionLabel={(option) => option.title}
                                                    value={{ title: distributor }}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={(params) => <TextField {...params} placeholder="Chọn Tên Nhà Phân Phối" variant="outlined"
                                                        onChange={(e) => {
                                                            setDistributor(e.target.value)
                                                            if (e.target.value === '') {
                                                                setDistributor("")
                                                            }
                                                            // setIdxDistributor(-1)
                                                        }}
                                                    />}
                                                    onChange={(e, value) => {
                                                        if (value) {
                                                            setDistributor(value.title)
                                                        } else {
                                                            setDistributor("")
                                                        }
                                                        // setIdxDistributor(value.id)
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                // style={{ display: openDistributerAndCatalog }} 
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Email NPP :</Typography>
                                                <Autocomplete
                                                    className="input-filter"
                                                    disabled={disabled}
                                                    size="small"
                                                    options={listDistributorEmail}
                                                    getOptionLabel={(option) => option.title}
                                                    value={{ title: distributorEmail }}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={(params) => <TextField {...params} placeholder="Chọn Email Nhà Phân Phối" variant="outlined"
                                                        onChange={(e) => {
                                                            if (e.target.value === '') {
                                                                setDistributorEmail("")
                                                            } else {
                                                                // props.getAgency(e.target.value)
                                                                setDistributorEmail(e.target.value)
                                                            }
                                                        }}
                                                    />}
                                                    onChange={(e, value) => {
                                                        // if (!e.target.value) {
                                                        //     props.getAgencyForcus()
                                                        // }
                                                        if (!value) {
                                                            setDistributorEmail("")
                                                        } else {
                                                            setDistributorEmail(value.title)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                // style={{ display: openDistributerAndCatalog }} 
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Tel NPP :</Typography>
                                                <Autocomplete
                                                    className="input-filter"
                                                    disabled={disabled}
                                                    size="small"
                                                    options={listDistributorTel}
                                                    getOptionLabel={(option) => option.title}
                                                    value={{ title: distributorTel }}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={(params) => <TextField {...params} placeholder="Chọn Số Điện Thoại Nhà Phân Phối" variant="outlined"
                                                        onChange={(e) => {
                                                            if (e.target.value === '') {
                                                                setDistributorTel("")
                                                            } else {
                                                                // props.getAgency(e.target.value)
                                                                setDistributorTel(e.target.value)
                                                            }
                                                        }}
                                                    />}
                                                    onChange={(e, value) => {
                                                        // if (!e.target.value) {
                                                        //     props.getAgencyForcus()
                                                        // }
                                                        if (!value) {
                                                            setDistributorTel("")
                                                        } else {
                                                            setDistributorTel(value.title)
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                // style={{ display: openDistributerAndCatalog }} 
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}
                                            >
                                                <Typography style={{ minWidth: 160 }}>Quyển <span id="require-icon" style={{ color: "red" }}>*</span></Typography>
                                                <Autocomplete
                                                    className="input-filter"
                                                    size="small"
                                                    options={listCatalogOption}
                                                    value={{ title: catalogName }}
                                                    getOptionLabel={(option) => option.title}
                                                    style={window.innerWidth <= 500 ? { width: '100%' } : { width: '100%' }}
                                                    renderInput={
                                                        (params) =>
                                                            <TextField {...params} placeholder="Chọn Quyển" variant="outlined"
                                                                onChange={(e, value) => {
                                                                    if (e.target.value !== '') {
                                                                        setCatalogName(e.target.value)
                                                                        setDisabled(false)
                                                                        setOpenBtnImportCatalog('inline-flex')
                                                                        if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                            props.getCatalogSearch(e.target.value)
                                                                        }
                                                                    } else {
                                                                        if (JSON.parse(localStorage.getItem("UI")).viewCatalog === 1 || JSON.parse(localStorage.getItem("UI")).isAdmin === 1) {
                                                                            props.getCatalogAll()
                                                                        }
                                                                        setCatalogName('')
                                                                        setOpenBtnImportCatalog('none')
                                                                    }
                                                                }}
                                                            />
                                                    }
                                                    onChange={(e, value) => {
                                                        if (!value) {
                                                            setUrlCatalog(emptyImg)
                                                            setCatalogName('')
                                                            setOpenBtnImportCatalog('none')
                                                            setDisabled(false)
                                                        } else {
                                                            setUrlCatalog(value.url)
                                                            setCatalog(value.id)
                                                            setCatalogName(value.title)
                                                            setDisabled(true)
                                                            setOpenBtnImportCatalog('none')
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        if (agency === '' && IdAgency === 0) {
                                                            props.getCatalogAll()
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="block-img">
                                            <div className="block-add-img">
                                                <div className="block-add-img-head" style={{
                                                    display: "flex"
                                                    // , flexDirection: "column" 
                                                }}>
                                                    <div>
                                                        <Typography style={{ marginRight: 15 }}>Ảnh sản phẩm</Typography>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginRight: 20
                                                    }}>
                                                        {invalidImage && <span style={{ color: "red" }}>{invalidImage}</span>}
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                        >
                                                            {/* Upload File */}
                                                            <Icon path={mdiUpload} size={1} />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={(e) => onChangeFile(e)}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="block-add-img-show-img">
                                                    {isPickedImage
                                                        ?
                                                        <>
                                                            {isLoadingImage && <img className="img-product-new" src={"https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif"} />}

                                                            <img style={isLoadingImage ? { display: "none" } : { display: "block" }} className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={imgURL} />
                                                        </>
                                                        :
                                                        <img src={imgUrlPreview} />
                                                    }
                                                    {/* <img className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={(isLoadingImage) ? "https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif" : imgUrl} /> */}
                                                    {/* <img src={imgURL ? imgURL : imgUrlPreview} className="img-product-new" /> */}
                                                </div>
                                            </div>
                                            <div className="block-add-img"
                                            //  style={{ display: openDistributerAndCatalog }}
                                            >

                                                <div className="block-add-img-show-img">
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        style={{
                                                            display: openBtnImportCatalog, marginLeft: "35%", marginTop: -12
                                                        }}
                                                    >
                                                        <Icon path={mdiUpload} size={1} />
                                                        <input
                                                            type="file"
                                                            hidden
                                                            onChange={(e) => onChangeFileCatalog(e)}
                                                        />
                                                    </Button>
                                                    {
                                                        isLoadingImageCatalog
                                                            ?
                                                            <img
                                                                src={loadImg}
                                                                className="img-product-new"
                                                                style={{ height: '300', display: "block" }}
                                                            />
                                                            :
                                                            <img
                                                                src={urlCatalog} className="img-product-new"
                                                                onLoad={() => setIsLoadingImageCatalog(false)}
                                                                onError={() => setIsLoadingImageCatalog(false)}
                                                                style={{ height: '300', display: "block" }}
                                                            />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="form-note">
                        <div className="form-input">
                            <Typography>Ghi chú</Typography>
                            <TextField className="note-textarea" variant="outlined" multiline={true} rows={5} size="small" />
                        </div>
                    </div> */}
                                </DialogContent>
                                <DialogActions className="actions-add-new-materials" style={
                                    window.innerWidth <= 500
                                        ?
                                        {
                                            display: "flex",
                                            justifyContent: "center",
                                            flexDirection: "column-reverse"
                                        }
                                        :
                                        {
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }

                                }>
                                    <span style={
                                        window.innerWidth <= 500
                                            ?
                                            {
                                                fontSize: 12, margin: "auto",
                                                paddingTop: 5
                                            }
                                            :
                                            {
                                                fontSize: 12, marginLeft: "4%"
                                            }}>Những trường hợp có  <span style={{ color: "red" }}>*</span> bắt buộc nhập</span>

                                    <div style={
                                        window.innerWidth <= 500
                                            ?
                                            {
                                                margin: "auto"
                                            }
                                            :
                                            {
                                                marginRight: 50
                                            }}>
                                        <Button className="btn-quick-creation" variant="contained"
                                            onClick={() => {
                                                if (catalog !== 0 && type !== '' && productCode !== '' && productName !== '') {
                                                    props.postProduct({ idCatalog: catalog, type: type, productName: productName, productCode: productCode, imgURL: imgURL })
                                                    if (window.location.pathname.match("project-creation")) {
                                                        props.chooseMaterial({
                                                            areaIndex: props.activeArea,
                                                            material: {
                                                                agency_id: Date.now(),
                                                                catalog_id: Date.now(),
                                                                catalog_image: urlCatalog,
                                                                catalog_name: catalogName,
                                                                code: productCode,
                                                                distributors: '',
                                                                fraction: fraction,
                                                                group: type,
                                                                group_id: Date.now(),
                                                                id: Date.now(),
                                                                image_url: imgURL,
                                                                material: material,
                                                                product: productName,
                                                                product_id: Date.now(),
                                                                supplier: agency
                                                            }
                                                        })
                                                    }

                                                    setImgURL(null)
                                                    setInvalidImage(null)
                                                } else {
                                                    if (validateEmail(distributorEmail) === false && distributorEmail !== "") {
                                                        alert("Vui lòng nhập đúng định dạng Email")
                                                    } else {
                                                        if (productCode !== '' && productName !== '' && catalogName !== ''
                                                            && material !== '' && fraction !== '') {
                                                            props.postProductInput({
                                                                productName: productName,
                                                                productCode: productCode,
                                                                type: type === '' ? "Chưa phân loại" : type,
                                                                material: material,
                                                                agnecy: agency === '' ? "Chưa nhập" : agency,
                                                                fraction: fraction,
                                                                distributorName: distributor.title === '' || distributor === '' ? "Chưa nhập" : distributor,
                                                                distributorMail: distributorEmail === '' ? "Chưanhập@gmail.com" : distributorEmail,
                                                                distributorTel: distributorTel === '' ? "Chưa nhập" : distributorTel,
                                                                catalogName: catalogName,
                                                                imageURL: imgURL,
                                                                catalogURL: urlCatalog
                                                            })
                                                            if (window.location.pathname.match("project-creation")) {
                                                                props.chooseMaterial({
                                                                    areaIndex: props.activeArea,
                                                                    material: {
                                                                        agency_id: Date.now(),
                                                                        catalog_id: Date.now(),
                                                                        catalog_image: urlCatalog,
                                                                        catalog_name: catalogName,
                                                                        code: productCode,
                                                                        distributors: '',
                                                                        fraction: fraction,
                                                                        group: type === '' ? "Chưa phân loại" : type,
                                                                        group_id: Date.now(),
                                                                        id: Date.now(),
                                                                        image_url: imgURL,
                                                                        material: material,
                                                                        product: productName,
                                                                        product_id: Date.now(),
                                                                        supplier: agency
                                                                    }
                                                                })
                                                            }

                                                        } else {
                                                            alert('Mời nhập thông tin đầy đủ')
                                                        }
                                                    }

                                                }
                                            }}

                                        > Tạo nhanh </Button>
                                        <Button
                                            style={{ marginLeft: 6 }}
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                props.handleClose()
                                            }
                                            } >Hủy</Button>
                                    </div>
                                </DialogActions>
                            </div>
                            :
                            <div className="container-add-new-materials">
                                <DialogTitle className="title-add-new-materials">
                                    <label className="title-head">
                                        <Typography variant="h6">Sửa vật liệu
                                    </Typography>
                                        <Icon onClick={() => props.handleClose()} path={mdiCloseThick} size={1} />
                                    </label>
                                </DialogTitle>
                                <DialogContent className="content-add-new-materials">
                                    <div className="wrap-block-add-new-materials">
                                        <div className="block-input-info"
                                            style={window.innerWidth <= 500
                                                ?
                                                { width: '100%' }
                                                :
                                                { width: '60%' }}>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}>
                                                <Typography style={{ minWidth: 160 }}>Tên sản phẩm :</Typography>
                                                <TextField
                                                    defaultValue={productName}
                                                    className="name-product" variant="outlined" size="small"
                                                    placeholder="Nhập Tên Sản Phẩm"
                                                    onChange={(e) => { setProductName(e.target.value) }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}>
                                                <Typography style={{ minWidth: 160 }}>Mã sản phẩm :</Typography>
                                                <TextField
                                                    defaultValue={productCode}
                                                    className="name-product" variant="outlined" size="small"
                                                    placeholder="Nhập Mã Sản Phẩm"
                                                    onChange={(e) => { setProductCode(e.target.value) }}
                                                />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }} >

                                                <Typography style={{ minWidth: 160 }}>Phân khúc :</Typography>
                                                <TextField
                                                    onChange={(e) => { setFraction(e.target.value) }}
                                                    placeholder="Nhập Phân Khúc"
                                                    defaultValue={fraction}
                                                    className="name-product" variant="outlined" size="small" />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }} >
                                                <Typography style={{ minWidth: 160 }}>Nhà cung cấp :</Typography>
                                                <TextField
                                                    defaultValue={agency === '' ? "Chưa nhập" : agency}
                                                    onChange={(e) => { setAgency(e.target.value) }}
                                                    placeholder="Nhập Nhà Cung Cấp"
                                                    className="name-product" variant="outlined" size="small" />
                                            </div>
                                            {/* <div className="form-input" >
                                                <Typography>Nhà phân phối</Typography>
                                                <TextField
                                                    onChange={(e) => { setDistributor(e.target.value) }}
                                                    defaultValue={JSON.parse(localStorage.getItem("UI")).isAdmin ?
                                                        distributor : distributor.slice(0, distributor.indexOf("\n"))}
                                                    className="name-product" variant="outlined" size="small" />
                                            </div> */}
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }} >
                                                <Typography style={{ minWidth: 160 }}>Mô tả :</Typography>
                                                <TextField
                                                    multiline
                                                    rows={5}
                                                    defaultValue={description}
                                                    onChange={(e) => { setDescription(e.target.value) }}
                                                    placeholder="Nhập Mô Tả"
                                                    className="name-product" variant="outlined" style={{ width: '100%' }} />
                                            </div>
                                            <div className="form-input"
                                                style={window.innerWidth <= 500
                                                    ?
                                                    { width: '100%' }
                                                    :
                                                    { width: '100%', display: "flex", alignItems: "center" }}>
                                                <Typography style={{ minWidth: 160 }}>Kích thước :</Typography>
                                                <TextField
                                                    placeholder="Nhập Kích Thước"
                                                    defaultValue={size}
                                                    onChange={(e) => { setSize(e.target.value) }}
                                                    className="name-product" variant="outlined" size="small" />
                                            </div>
                                            <div className="form-input" style={window.innerWidth <= 500
                                                ?
                                                { width: '100%' }
                                                :
                                                { width: '100%', display: "flex", alignItems: "center" }}>
                                                <Typography style={{ minWidth: 160 }}>Ghi chú</Typography>
                                                <TextField
                                                    multiline
                                                    rows={5}
                                                    onChange={(e) => { setNote(e.target.value) }}
                                                    defaultValue={note}
                                                    placeholder="Nhập Ghi Chú"
                                                    className="name-product" variant="outlined" style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div className="block-img">
                                            <div className="block-add-img">
                                                <div className="block-add-img-head" style={{ display: "flex" }}>
                                                    <div>
                                                        <Typography>Ảnh sản phẩm</Typography>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {invalidImage && <span style={{ color: "red" }}>{invalidImage}</span>}
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                        >
                                                            {/* Upload File */}
                                                            <Icon path={mdiUpload} size={1} />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={(e) => onChangeFile(e)}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="block-add-img-show-img">
                                                    <>
                                                        <img style={isLoadingImage ? { display: "block" } : { display: "none" }} className="img-product-new" src={"https://i.pinimg.com/originals/ec/d6/bc/ecd6bc09da634e4e2efa16b571618a22.gif"} />

                                                        <img style={isLoadingImage ? { display: "none" } : { display: "block" }} className="img-product-new" onLoad={() => setIsLoadingImage(false)} src={imgURL ? imgURL :
                                                            (props.product.image_url ? props.product.image_url : imgUrlPreview)} />
                                                    </>
                                                </div>
                                            </div>
                                            <div className="block-add-img">
                                                <div className="block-add-img-head" style={{ display: "flex" }}>
                                                    <Typography>Quyển</Typography>

                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {invalidImageCat && <span style={{ color: "red" }}>{invalidImageCat}</span>}
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                        >
                                                            {/* Upload File */}
                                                            <Icon path={mdiUpload} size={1} />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                onChange={handleUpdateCatalog}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="block-add-img-show-img">
                                                    <>
                                                        <img
                                                            style={isLoadingImageCatalog ? { display: "block" } : { display: "none" }}
                                                            className="img-product-new"
                                                            src={loadImg}
                                                        />

                                                        <img
                                                            style={isLoadingImageCatalog ? { display: "none" } : { display: "block" }}
                                                            className="img-product-new"
                                                            onLoad={() => setIsLoadingImageCatalog(false)}
                                                            src={imgCatalog ? imgCatalog :
                                                                (props.product.catalog_image ? props.product.catalog_image : imgUrlPreview)}
                                                        />
                                                    </>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    {/* <div className="form-note">
                        <div className="form-input">
                            <Typography>Ghi chú</Typography>
                            <TextField className="note-textarea" variant="outlined" multiline={true} rows={5} size="small" />
                        </div>
                    </div> */}
                                </DialogContent>
                                <DialogActions className="actions-add-new-materials">
                                    <Button className="btn-quick-creation" variant="contained"
                                        onClick={() => {
                                            props.putProduct({
                                                areaIndex: props.areaIndex,
                                                idProduct: props.product.id,
                                                productName: productName,
                                                productCode: productCode,
                                                fraction: fraction,
                                                agency: agency,
                                                distributor: distributor,
                                                description: description,
                                                note: note,
                                                size: size,
                                                imgURL: imgURL,
                                                imgCatalog: imgCatalog
                                            })
                                            setImgCatalog(null)
                                            setInvalidImageCat(null)
                                            props.handleClose()
                                            props.reload(true)
                                        }}
                                    >    Sửa nhanh</Button>
                                    <Button variant="contained" color="secondary" onClick={() => props.handleClose()} >Hủy</Button>
                                </DialogActions>
                            </div>)
                }

            </div >
        )
    })

export { DialogAddNewProduct, AddNewProductMobile };