import React, { useState, useEffect } from 'react'
import { Breadcrumbs, Link, Typography, Button, Paper, TextField, Dialog, DialogContent } from '@material-ui/core'
import SearchComponent from '../_Common/SearchComponent'
import { mdiUpload } from '@mdi/js';
import Icon from '@mdi/react'
import Pagination from "../_Common/PaginationComponent"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import emptyImage from "../../styles/images/no-images.png"
import img from "../../styles/images/img-product-1.jpg"
import { DOMAIN_IMAGE } from "../../constants/callAPI"
import uploadImage from "../../api/uploadImage"
import { connect } from "react-redux";
import { getProductByIdRequest, putProduct, postProduct, deleteProduct } from "../../constants/actionCreators"
const ItemProductCatalog = (props) => {
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const product = window.innerWidth <= 768 ? {
        fontWeight: 'bold',
        fontSize: 13,
        width: '100%',
    }
    :
    {
        fontWeight: 'bold',
        fontSize: 'calc(100vw * 16 / 1366)',
        width: '100%',
    }

    useEffect(() => setIsLoadingImage(true), [props.item.image_url]);
    return (
        <Paper className="item-product-catalog" variant="outlined">
            <img
                className="img-product"
                src={isLoadingImage ? loadImg : props.item.image_url === '' ? emptyImage : props.item.image_url}
                onLoad={() => setIsLoadingImage(false)}
                onError={() => setIsLoadingImage(false)}
            />
            <div className="info-product">
                <p style={product}>{props.item.product}</p>
                <p>{props.item.group}</p>
                <p>{props.item.code}</p>
                <div className="action-product">
                    <Button
                        variant="contained"
                        onClick={() => {
                            props.handleOpenModal(true)
                            props.handleProduct({
                                id: props.item.id,
                                name: props.item.product,
                                code: props.item.code,
                                fraction: props.item.group,
                                img_product: props.item.image_url
                            })
                            props.title('Sửa')
                        }}
                    >Sửa</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (window.confirm(`Xác nhận xóa sản phẩm mã ${props.item.code}!`)) {
                                props.deleteProduct({ id: props.item.id, activePage: props.activePage, idCatalog: props.idCatalog })
                            }
                        }}
                        style={{ marginLeft: 10, backgroundColor: '#d32f2f', color: 'white' }}
                    >Xóa</Button>
                </div>
            </div>
        </Paper>
    )
}


const ModalHandleProduct = (props) => {
    const [productDetial, setProductDetial] = useState(props.itemProduct)
    const [name, setName] = useState(props.itemProduct.name)
    const [fraction, setFraction] = useState(props.itemProduct.fraction)
    const [code, setCode] = useState(props.itemProduct.code)
    const [imageUrl, setImageUrl] = useState(null)
    const animationLoading = loadImg;
    const [invalidImage, setInvalidImage] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    useEffect(() => {
        if (props.itemProduct !== '') {
            setName(props.itemProduct.name)
            setFraction(props.itemProduct.fraction)
            setCode(props.itemProduct.code)
            setImageUrl(props.itemProduct.img_product)
        } else {
            setName('')
            setFraction('')
            setCode('')
            setImageUrl('')
        }
    }, [props.itemProduct])
    const handleItemProduct = () => {
        if (props.itemProduct !== '') {
            props.editProduct({
                id: props.itemProduct.id,
                name: name,
                group: fraction,
                code: code,
                imageUrl: imageUrl,
                activePage: props.activePage,
                idCatalog: props.idCatalog
            })
        } else {
            if (name !== '' && fraction !== '' && code !== '') {
                props.addProduct({
                    name: name,
                    group: fraction,
                    code: code,
                    imageUrl: imageUrl,
                    activePage: props.activePage,
                    idCatalog: props.idCatalog
                })
            }
        }
    }

    const onChangeFile = async (event) => {
        setIsLoadingData(true)
        const imageFile = event.target.files[0];
        if (!imageFile) {
            setInvalidImage('Vui lòng chọn ảnh!')
            setIsLoadingData(true)
            return false;
        }

        if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
            setInvalidImage('Định dạng ảnh không hỗ trợ!')
            setIsLoadingData(true)
            return false;
        }
        const res = await uploadImage(imageFile)
        if (res.err) {
            alert("Đã xảy ra lỗi khi thêm ảnh!")
        } else {
            // setIsLoadingData(false)
            setImageUrl(DOMAIN_IMAGE + res.fileName)
        }
        setInvalidImage(null)
    }
    return (
        <Dialog
            className="container-handle-product"
            open={props.open}
        >
            <DialogContent className="dialog-content">
                <div className="form-edit">
                    <div className="block-img">
                        <img style={isLoadingData ? { display: "block" } : { display: "none" }} className="img-product"
                            src={animationLoading}
                        // onError={() => {setIsLoadingData(false)}}
                        // onLoad={()=>  setIsLoadingData(false)}
                        />
                        <img style={isLoadingData ? { display: "none" } : { display: "block" }} className="img-product"
                            src={imageUrl ? imageUrl : props.itemProduct.img_product}
                            // onError={() => {setIsLoadingData(false)}}
                            onLoad={() => setIsLoadingData(false)}
                        />
                        {invalidImage && <p style={{ color: "red" }}>{invalidImage}</p>}
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
                    <div className="info-product">
                        <div className="form-input">
                            <p>Tên sp:</p>
                            <TextField variant="outlined" size="small"
                                defaultValue={props.itemProduct.name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <p>Loại :</p>
                            <TextField variant="outlined" size="small"
                                defaultValue={props.itemProduct.fraction}
                                onChange={(e) => setFraction(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <p>Mã :</p>
                            <TextField variant="outlined" size="small"
                                defaultValue={props.itemProduct.code}
                                onChange={(e) => setCode(e.target.value)} />
                        </div>
                        <div className="form-input btn-actions">
                            <Button variant="contained" color="primary" onClick={() => {
                                if (!isLoadingData) {
                                    handleItemProduct();
                                    props.handleClose();
                                    setImageUrl(null)
                                    setInvalidImage(null)
                                } else {
                                    alert('Vui lòng đợi ảnh tải xong!!');
                                }
                            }}>{props.title}</Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => { props.handleClose(); setImageUrl(null) }}
                            >Hủy</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const mapStateToProps = (state) => {
    return {
        listProductByCatalog: state.productReducer.listProductByCatalog,
        activePage: state.productReducer.activePageByCatalog,
        totalPage: state.productReducer.totalPageByCatalog,
        isLoading: state.productReducer.isFetching
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getProductByCatalog: (data) => dispatch(getProductByIdRequest(data)),
        editProduct: (data) => dispatch(putProduct(data)),
        addProduct: (data) => dispatch(postProduct(data)),
        deleteProduct: (data) => dispatch(deleteProduct(data))
    }
}
const ProductList = connect(mapStateToProps, mapDispatchToProps)((props) => {
    const [openModal, setOpenModal] = useState(false)
    const [product, setProduct] = useState('')
    useEffect(() => {
        props.getProductByCatalog({ id: props.idCatalog, activePage: 1 })
    }, [])
    useEffect(() => setOpenModal(props.openModal), [props.openModal])
    return (
        <div className="container-product-list">
            {/* <div className="product-list-head">
                <Breadcrumbs>
                    <Link color="inherit"
                        // href="/dashboard/catalog"
                        onClick={() => props.handleShow()}
                    >
                        Quay lại
                    </Link>
                    <Typography color="textPrimary">Quyển B</Typography>
                </Breadcrumbs>
                <div className="action-right">
                    <Button
                        variant="contained"
                        onClick={() => setOpenModal(true)}
                    >Thêm</Button>
                    <SearchComponent />
                </div>
            </div> */}
            {/* <div style={{ display: "flex", justifyContent: "center" }}> */}
            <div>
                {props.isLoading ?
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img width="30%" src={loadImg} />
                    </div>
                    :
                    <div className="product-list-content" >
                        {props.listProductByCatalog && props.listProductByCatalog.map((item, idx) => {
                            return (
                                <ItemProductCatalog
                                    key={idx}
                                    handleOpenModal={(val) => props.setOpenModal(val)}
                                    putProduct={(data) => props.putProduct(data)}
                                    deleteProduct={(data) => props.deleteProduct({
                                        ...data,
                                        textSearch: props.textSearch !== "" ? props.textSearch : null
                                    })}
                                    item={item}
                                    activePage={props.activePage}
                                    handleProduct={(item) => props.setItemProduct(item)}
                                    title={(text) => props.setTitleButton(text)}
                                    idCatalog={props.idCatalog}
                                />
                            )
                        })

                        }
                    </div>
                }
            </div>
            <div className="product-list-footer">
                <Pagination
                    activePage={props.activePage}
                    totalPage={props.totalPage}
                    onPaginate={activePage => props.getProductByCatalog({
                        id: props.idCatalog,
                        activePage: activePage,
                        textSearch: props.textSearch !== "" ? props.textSearch : null
                    })}
                />
            </div>
            <ModalHandleProduct
                open={props.openModal}
                handleClose={() => props.setOpenModal(false)}
                itemProduct={props.itemProduct}
                title={props.title}
                editProduct={(data) => props.editProduct({
                    ...data,
                    textSearch: props.textSearch !== "" ? props.textSearch : null
                })}
                activePage={props.activePage}
                idCatalog={props.idCatalog}
                addProduct={props.addProduct}
            //item={item}
            />
        </div>
    )
})


export default ProductList