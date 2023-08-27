import React from 'react'
import { Checkbox, Button } from '@material-ui/core'
import { Icon } from '@mdi/react'
import { mdiCloseThick } from '@mdi/js'
import img from "../../styles/images/img-product-1.jpg"
import "../../styles/scss/common/item-product.scss"
import "../../styles/scss/common/table-product.scss"
import { mdiSquareEditOutline, mdiDelete } from '@mdi/js'
import {
    Typography, Paper, CardMedia,
    Table, TableBody, TableRow, TableCell, TableContainer, TableHead,
    Input, TextField, debounce, TextareaAutosize
} from '@material-ui/core';
const ItemProduct = (props) => {
    // const item = props.listSelection.rows;
    return (
        <div className="block-materials-mobile">
            <div className="img-materials">
                <img src={""} />
            </div>
            <div className="detail-info">
                <div className="detail-info-left">
                    {/* <p> aaaaaaaaaaaaaa aaaaaaaa aaa</p> */}
                    <p>zz</p>
                    <p>Bình dân</p>
                    <p>S1001</p>
                </div>
                <div className="detail-info-right">
                    <p>&nbsp;</p>
                    <p>Mã NCC</p>
                    <p>Brandname</p>
                    <p>Tên NPP</p>
                </div>
            </div>
            <div className="action-wrap">
                <Button className="icon">
                    <Icon className="icon-remove" path={mdiCloseThick} size={0.8} />
                </Button>
                <div className="icon">
                    {props.chooseMaterials &&
                        <Checkbox className="checkbox-choose-materials" color="primary" />
                    }
                </div>
            </div>
        </div>
        //==========================================================================================nho bo } </div> xuong duoi doan commen duoi nay
        // <div className="table-list-product">
        //     <TableContainer component={Paper} className="table-container-dialog">
        //         <div style={{ backgroundColor: "#fbfbfb", borderRadius: "5px" }} className="wrap-item-product">
        //             <div className="product-col product-catalog">
        //                 <div
        //                     className="inner-image"
        //                     style={{
        //                         backgroundImage: `url(${item.image_url})`,
        //                         position: "relative",
        //                         marginBottom: 15,
        //                         overflow: 'hidden'
        //                     }}
        //                 >
        //                     <span style={{
        //                         background: 'linear-gradient(to bottom, #ececec, #d6d6d6)',
        //                         padding: "1px 7px",
        //                         fontWeight: "bold",
        //                         position: "absolute",
        //                         bottom: 0,
        //                         color: '#333'
        //                     }}> Mã: {item.code}</span>
        //                 </div>

        //                 <div
        //                     className="inner-image"
        //                     style={{
        //                         // backgroundImage: `url(${item.catalog_image})`,
        //                         position: "relative",
        //                         overflow: 'hidden'
        //                     }}
        //                 >
        //                     <span style={{
        //                         background: 'linear-gradient(to bottom, #ececec, #d6d6d6)',
        //                         padding: "1px 7px",
        //                         fontWeight: "bold",
        //                         position: "absolute",
        //                         bottom: 0,
        //                         color: '#333'
        //                     }}> {item.catalog_name}</span>

        //                 </div>
        //             </div>
        //             <div className="product-col product-info">
        //                 <span style={{ fontWeight: "bold", display: "inline" }}>Danh mục vật liệu: <span style={{ fontWeight: "normal", display: "inline", fontSize: "18px" }}> {item.material}</span></span>
        //                 <span style={{ fontWeight: "bold", display: "inline" }}>Mã vật liệu: <span style={{ fontWeight: "normal", display: "inline", fontSize: "18px" }}> {item.code}</span></span>

        //                 <span style={{ fontWeight: "bold" }}>Mô tả sản phẩm:</span>
        //                 <TextField
        //                     id="outlined-multiline-static"
        //                     // label="Nhập mô tả sản phẩm"
        //                     multiline
        //                     rows={4}
        //                     defaultValue={item.description && item.description}
        //                     variant="outlined"
        //                     fullWidth
        //                     onChange={debounce((e) => {
        //                         props.saveDescription({
        //                             description: e.target.value,
        //                             idProduct: item.id,
        //                             areaIndex: props.areaIndex
        //                         })
        //                     }, 250)
        //                     }
        //                 />
        //                 <span style={{ fontWeight: "bold" }}>Ghi chú:</span>
        //                 <TextField
        //                     // onClick={() => setOpenNote(true)}
        //                     defaultValue={item.note && item.note}
        //                     // label="Nhập ghi chú"
        //                     multiline
        //                     rows={2}
        //                     variant="outlined"
        //                     size="small"
        //                     className="input"
        //                     onChange={debounce((e) => {
        //                         props.saveNote({
        //                             note: e.target.value,
        //                             idProduct: item.id,
        //                             areaIndex: props.areaIndex
        //                         })
        //                     }, 250)
        //                     }
        //                 />
        //             </div>

        //             <div className="product-action">
        //                 <Button className="btn-quick-fixes" variant="contained"
        //                     onClick={() => {
        //                         // setOpenDialogAddNew(true)
        //                     }}
        //                 >
        //                     <Icon path={mdiSquareEditOutline} size={1} />
        //                 </Button>
        //                 {/* <DialogAddNewProduct
        //                     areaIndex={props.areaIndex}
        //                     product={item}
        //                     open={openDialogAddNew}
        //                     type='update'
        //                     // handleClose={() => setOpenDialogAddNew(false)}
        //                     reload={(data) => { setReload(data) }}
        //                 /> */}
        //                 <Button className="btn-remove" variant="contained" onClick={() => {
        //                     props.listProduct.length === 0 ? console.log(props.listProduct.length + " Bang 0: ", props.activePage - 1) : console.log(props.listProduct.length + " khac Bang 0: ", props.activePage)
        //                     props.dropProduct({
        //                         productIndex: item.id,
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

    )
}
export { ItemProduct }