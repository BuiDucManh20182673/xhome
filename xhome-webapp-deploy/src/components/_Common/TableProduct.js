import React, { useEffect, useState } from 'react';
import {
    Button, Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Checkbox,
    TextField, debounce, Paper
} from '@material-ui/core';
import Dialog from "@material-ui/core/Dialog";
import { Icon } from '@mdi/react'
import { mdiSquareEditOutline, mdiDelete, mdiContentCopy } from '@mdi/js'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
// import img from "../../styles/images/img-product-1.jpg"
import "../../styles/scss/common/table-product.scss"
import "../../styles/scss/table-choose.scss"
import '../../styles/scss/container/distributor-component.scss';
import "../../styles/scss/container/product-component.scss"
import emptyImg from "../../styles/images/no-images.png"
import { DialogAddNewProduct } from '../_Common/ModalProduct'
import { connect } from "react-redux"
import * as actions from "../../constants/actionCreators"

const mapStateToProps = (state) => {
    return {
        projectReducer: state.projectReducer,
        isLoadingSave: state.projectReducer.isLoadingSave,
        listIdChoosedMaterial: state.projectReducer.listIdChoosedMaterial,
        listCopyProductToArea: state.projectReducer.listCopyProductToArea,
    }
}
const mapDispathToProps = (dispatch) => {
    return {
        cancelCopy: (data) => {
            dispatch(actions.cancelCopyProductToArea(data))
        }
    }
}

const TableChooseCopyProduct = connect(mapStateToProps, mapDispathToProps)((props) => {
    const { openTableChoose, closeTableChoose, listArea, copyProductToArea, product, listIdChoosedMaterial,
        listChecked, setListChecked, listCopyProductToArea, cancelCopy } = props
    let listData = [];
    let listIndexChoosed = []


    let flagChange = false;
    useEffect(async () => {
        await checkedTableChoose();
        setListChecked(listIndexChoosed)
    }, [listCopyProductToArea]);

    let checkedTableChoose = function () {
        listIdChoosedMaterial.map((items, idx) => {
            let flag = false;
            items.map((item, index) => {
                if (item === product.id) {
                    flag = true;
                }
            })

            if (flag) {
                flagChange = true
                listIndexChoosed.push({ idx: idx, status: true })
            }
        })

    }

    useEffect(() => {
        setListChecked(listIndexChoosed)
        flagChange = false;
    }, [flagChange]);

    const handleChange = (isChecked, idx) => {
        if (isChecked) {
            setListChecked([...listChecked, { idx, status: isChecked }])
        } else {
            setListChecked(listChecked.filter(item => item.idx !== idx))
        }
    }
    if (listArea && listArea.length > 0) {
        listArea.map((item, idx) => {
            let isChecked = listChecked.filter(item => item.idx === idx)[0]
            listData.push(
                <TableRow className="row-choose" key={idx}>
                    <TableCell style={{
                        width: "50px", textAlign: 'center', borderBottom: "0px"
                    }}>
                        <Checkbox
                            onChange={(e) => handleChange(e.target.checked, idx)}
                            checked={
                                isChecked?.status
                                    ?
                                    isChecked.status
                                    :
                                    false
                            }
                        />
                    </TableCell>
                    <TableCell style={{ borderBottom: "0px" }}>
                        <div className="row-content" > {item.area} </div>
                    </TableCell>
                </TableRow>
            )
        })
    }

    return (
        <>
            <Dialog
                open={openTableChoose}
                onClose={closeTableChoose}
            >
                <div className="container-dialog">
                    <div className="table-container-choose">
                        <div colSpan={100} className="table-content">
                            Sao chép sản phẩm
                        </div>
                        <Table >
                            <TableHead className="table-header">
                                <TableCell className="table-header-checbox" style={{ width: "50px", textAlign: 'center', fontWeight: 'bold' }}>
                                    Chọn
                                </TableCell>
                                <TableCell className="table-header-area" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    Khu Vực
                                </TableCell>
                            </TableHead>
                            <TableBody>
                                {listData}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="btn-group-choose">
                        <Button className=" btn-complete btn-choose"
                            onClick={() => {
                                copyProductToArea({
                                    product: product,
                                    areaIndex: listChecked
                                })
                                closeTableChoose()
                            }}
                        >Xong </Button>
                        <Button className=" btn-cacel btn-cancel-choose"
                            onClick={() => {
                                cancelCopy()
                                closeTableChoose()
                            }}
                        >Hủy </Button>
                    </div>
                </div>


            </Dialog>
        </>
    )
})


const TableProduct = (props) => {
    const { chooseMaterials, selectedMaterial, materialsByArea, listArea, copyProductToArea, listIdChoosedMaterial } = props
    const tableProduct = props.typeTable;
    const openList = props.openList;
    let index = openList ? props.index : props.beginPoint + props.index
    const [reload, setReload] = useState(false);
    const [openDialogAddNew, setOpenDialogAddNew] = useState(false)
    const [size, setSize] = useState("");
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [openTableChoose, setOpenTableChoose] = useState(false);
    const [listChecked, setListChecked] = useState([])
    const [displayDescription, setDisplayDescription] = useState(false)
    const [displayNote, setDisplayNote] = useState(false)
    let handleCloseTableChoose = () => {
        setOpenTableChoose(false)
    }
    useEffect(() => {
        if (props.product.image_url === "") {
            setIsLoadingImage(false)
        } else {
            setIsLoadingImage(true)
        }
    }, [props.product.image_url])

    useEffect(() => {
        if (props.product.catalog_image === "") {
            setIsLoadingImage(false)
        } else {
            setIsLoadingImage(true)
        }
    }, [props.product.catalog_image])
    // const [noteAndDes, setNoteAndDes] = useState({note: "", description: ""});
    // const handleSetNoteAndDes = (att, val) => {
    //     setNoteAndDes({...noteAndDes, [att]: val})
    // }
    const [openNote, setOpenNote] = React.useState(false);
    const [openDescription, setOpenDescription] = React.useState(false);
    React.useEffect(() => setSize(props.product.size), [props.product.size])
    // React.useEffect(() => handleSetNoteAndDes("description", props.product.description),[props.product.description])
    // React.useEffect(() => handleSetNoteAndDes("note", props.product.note),[props.product.note])

    const handleChangeDescription = function (text) {
        if (text.length > 2000) {
            setDisplayDescription(true)
        } else {
            setDisplayDescription(false)

        }
    }
    const handleChangeNote = function (text) {
        if (text.length > 2000) {
            setDisplayNote(true)
        } else {
            setDisplayNote(false)

        }
    }

    return (
        // <div className="table-list-product">
        //     <TableContainer component={Paper} className="table-container-dialog">
        //         <div className="wrap-item-product">
        //             <div className="product-col product-image">
        //                 <div
        //                     className="inner-image"
        //                     style={{ backgroundImage: `url(${props.product.image_url})` }}></div>
        //             </div>
        //             <div className="product-col product-info">
        //                 <span className="product-info-name" style={{ fontWeight: 'bold' }}>{props.product.material}</span>
        //                 <span className="product-info-code">{props.product.product}</span>
        //                 <span className="product-info-material">{props.product.code}</span>
        //             </div>
        //             <div key={props.product.id} className="product-col product-description">
        //                 <span className="product-description-">
        //                     <TextField value={size} variant="outlined" size="small"
        //                         onChange={(e) => setSize(e.target.value)} 
        //                         onBlur={() => props.saveSize({
        //                             size: size,
        //                             idProduct: props.product.id,
        //                             areaIndex: props.areaIndex
        //                         })}
        //                         className="input" placeholder="Nhập kích thước ..." />

        //                 </span>
        //                 <span className="product-description-">
        //                     <TextField
        //                         onClick={() => setOpenDescription(true)}
        //                         value={props.product.description && props.product.description}
        //                         variant="outlined"
        //                         size="small"
        //                         className="input"
        //                         placeholder="Nhập mô tả ..."
        //                     />
        //                     <Dialog
        //                         fullWidth="md"
        //                         open={openDescription}
        //                         onClose={() => setOpenDescription(false)}
        //                         aria-labelledby="form-dialog-title"
        //                     >
        //                         {/* <DialogTitle id="form-dialog-title">Mô tả sản phẩm</DialogTitle> */}
        //                         <DialogContent>
        //                             <TextField
        //                                 id="outlined-multiline-static"
        //                                 label="Nhập mô tả sản phẩm"
        //                                 multiline
        //                                 rows={4}
        //                                 autoFocus='true'
        //                                 defaultValue={props.product.description && props.product.description}
        //                                 variant="outlined"
        //                                 fullWidth
        //                                 onChange={debounce((e) => {
        //                                     props.saveDescription({
        //                                         description: e.target.value,
        //                                         idProduct: props.product.id,
        //                                         areaIndex: props.areaIndex
        //                                     })
        //                                 }, 250)
        //                                 }
        //                             />
        //                         </DialogContent>
        //                         <br />
        //                     </Dialog>
        //                 </span>
        //                 <span className="product-description-">
        //                     <TextField
        //                         onClick={() => setOpenNote(true)}
        //                         value={props.product.note && props.product.note}
        //                         variant="outlined"
        //                         size="small"
        //                         className="input"
        //                         placeholder="Nhập ghi chú ..."
        //                         // onChange={debounce((e) => {
        //                         //     props.saveNote({
        //                         //         note: e.target.value,
        //                         //         idProduct: props.product.id,
        //                         //         areaIndex: props.areaIndex
        //                         //     })
        //                         // }, 250)
        //                         // }
        //                     />
        //                     <Dialog
        //                         fullWidth="md"
        //                         open={openNote}
        //                         onClose={() => setOpenNote(false)}
        //                         aria-labelledby="form-dialog-title"
        //                     >
        //                         {/* <DialogTitle id="form-dialog-title">Ghi chú sản phẩm</DialogTitle> */}
        //                         <DialogContent>
        //                             <TextField
        //                                 id="outlined-multiline-static"
        //                                 label="Nhập ghi chú sản phẩm"
        //                                 multiline
        //                                 rows={4}
        //                                 autoFocus='true'
        //                                 defaultValue={props.product.note && props.product.note}
        //                                 variant="outlined"
        //                                 fullWidth
        //                                 onChange={debounce((e) => {
        //                                     props.saveNote({
        //                                         note: e.target.value,
        //                                         idProduct: props.product.id,
        //                                         areaIndex: props.areaIndex
        //                                     })
        //                                 }, 250)
        //                                 }
        //                             />
        //                         </DialogContent>
        //                         <br />
        //                     </Dialog>
        //                 </span>
        //             </div>
        //             <div className="product-col product-catalog">
        //                 <div
        //                     className="inner-image"
        //                     style={{ backgroundImage: `url(${props.product.catalog_image})` }}></div>
        //             </div>
        //             <div className="product-action">
        //                 <Button className="btn-quick-fixes" variant="contained"
        //                     onClick={() => {
        //                         setOpenDialogAddNew(true)
        //                     }}
        //                 >
        //                     <Icon path={mdiSquareEditOutline} size={1} />
        //                 </Button>
        //                 <DialogAddNewProduct
        //                     areaIndex={props.areaIndex}
        //                     product={props.product}
        //                     open={openDialogAddNew}
        //                     type='update'
        //                     handleClose={() => setOpenDialogAddNew(false)}
        //                     reload={(data) => { setReload(data) }}
        //                 />
        //                 <Button className="btn-remove" variant="contained" onClick={() => {
        //                     props.listProduct.length === 0 ? console.log(props.listProduct.length + " Bang 0: ", props.activePage - 1) : console.log(props.listProduct.length + " khac Bang 0: ", props.activePage)
        //                     props.dropProduct({
        //                         productIndex: props.product.id,
        //                         areaIndex: props.areaIndex,
        //                         activePage: props.listProduct.length === 1 ? props.activePage - 1 : props.activePage,
        //                         // activePage: props.activePage
        //                     })
        //                 }}>
        //                     <Icon path={mdiDelete} size={1} />
        //                 </Button>
        //             </div>
        //         </div>
        //     </TableContainer>
        // </div>
        <div className="table-list-product">
            <TableContainer component={Paper} className="table-container-dialog">
                <div style={{ backgroundColor: "#fbfbfb", borderRadius: "5px" }} key={props.product.id} className="wrap-item-product">
                    <div className="product-col product-catalog">

                        <div
                            className="inner-image"
                            style={{
                                backgroundImage: `url(
                                    "${isLoadingImage ? loadImg : props.product.image_url === "" ? emptyImg : props.product.image_url}")`,
                                position: "relative",
                                marginBottom: 15,
                                overflow: 'hidden'
                            }}
                        >
                            <img style={{ display: 'none' }}
                                src={props.product.image_url}
                                onLoad={() => setIsLoadingImage(false)}
                                onError={() => setIsLoadingImage(false)}
                            />
                            <span style={{
                                background: 'linear-gradient(to bottom, #ececec, #d6d6d6)',
                                padding: "1px 7px",
                                fontWeight: "bold",
                                position: "absolute",
                                bottom: 0,
                                color: '#333'
                            }}> Mã: {props.product.code}</span>
                        </div>

                        <div
                            className="inner-image"
                            style={{
                                backgroundImage: `url(
                                    "${isLoadingImage ? loadImg : props.product.catalog_image === "" ? emptyImg : props.product.catalog_image}")`,
                                // backgroundImage: `url(
                                //     ${isLoadingImage ? loadImg : props.product.catalog_image === "" ? emptyImg : props.product.catalog_image})
                                //     )`,
                                position: "relative",
                                overflow: 'hidden'
                            }}
                        >
                            <img style={{ display: 'none' }}
                                src={props.product.catalog_image}
                                onLoad={() => setIsLoadingImage(false)}
                                onError={() => setIsLoadingImage(false)}
                            />
                            <span style={{
                                background: 'linear-gradient(to bottom, #ececec, #d6d6d6)',
                                padding: "1px 7px",
                                fontWeight: "bold",
                                position: "absolute",
                                bottom: 0,
                                color: '#333'
                            }}> {props.product.catalog_name}</span>

                        </div>
                    </div>
                    <div className="product-col product-info">
                        <span style={{ fontWeight: "bold", display: "inline" }}>Danh mục vật liệu: <span style={{ fontWeight: "normal", display: "inline", fontSize: "18px" }}> {props.product.material}</span></span>
                        <span style={{ fontWeight: "bold", display: "inline" }}>Mã vật liệu: <span style={{ fontWeight: "normal", display: "inline", fontSize: "18px" }}> {props.product.code}</span></span>

                        <span style={{ fontWeight: "bold" }}>Mô tả sản phẩm:</span>
                        <TextField
                            id="outlined-multiline-static"
                            // label="mô tả sản phẩm"
                            multiline
                            rows={4}
                            defaultValue={props.product.description && props.product.description}
                            variant="outlined"
                            fullWidth
                            onChange={debounce((e) => {
                                handleChangeDescription(e.target.value)
                                props.saveDescription({
                                    description: e.target.value,
                                    idProduct: props.product.id,
                                    areaIndex: props.areaIndex
                                })
                            }, 250)
                            }
                        />
                        <span className="text_error_length" style={displayDescription === true ? { display: "block" } : { display: "none" }}>Mô tả không được quá 2000 kí tự</span>
                        <span style={{ fontWeight: "bold" }}>Ghi chú:</span>
                        <TextField
                            onClick={() => setOpenNote(true)}
                            defaultValue={props.product.note && props.product.note}
                            // label="Nhập ghi chú"
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                            className="input"
                            onChange={debounce((e) => {
                                handleChangeNote(e.target.value)
                                props.saveNote({
                                    note: e.target.value,
                                    idProduct: props.product.id,
                                    areaIndex: props.areaIndex
                                })
                            }, 250)
                            }
                        />
                        <span className="text_error_length" style={displayNote === true ? { display: "block" } : { display: "none" }}>Ghi chú không được quá 2000 kí tự</span>
                    </div>


                    <div className="product-action">
                        <Button className="btn-quick-fixes" variant="contained"
                            onClick={() => {
                                setOpenDialogAddNew(true)
                            }}
                        >
                            <Icon path={mdiSquareEditOutline} size={1} />
                        </Button>
                        <DialogAddNewProduct
                            areaIndex={props.areaIndex}
                            product={props.product}
                            open={openDialogAddNew}
                            type='update'
                            handleClose={() => setOpenDialogAddNew(false)}
                            reload={(data) => { setReload(data) }}
                        />

                        <Button style={{ marginTop: "3px", marginBottom: "3px" }} className="btn-quick-fixes" variant="contained"
                            onClick={() => { setOpenTableChoose(true) }}
                        >
                            <Icon path={mdiContentCopy} size={1} />
                        </Button>

                        <TableChooseCopyProduct
                            openTableChoose={openTableChoose}
                            closeTableChoose={handleCloseTableChoose}
                            listArea={listArea}
                            copyProductToArea={copyProductToArea}
                            product={props.product}
                            listChecked={listChecked}
                            setListChecked={(data) => { setListChecked(data) }}
                        // const [listChecked, setListChecked] = useState([])
                        // listIdChoosedMaterial={props.listIdChoosedMaterial}
                        />

                        <Button className="btn-remove" variant="contained" onClick={() => {
                            props.dropProduct({
                                productIndex: props.product.id,
                                areaIndex: props.areaIndex,
                                activePage: props.listProduct.length === 1 ? props.activePage - 1 : props.activePage,
                                // activePage: props.activePage
                            })
                        }}>
                            <Icon path={mdiDelete} size={1} />
                        </Button>

                    </div>
                </div>
            </TableContainer>
        </div>
    )
}



export { TableProduct }