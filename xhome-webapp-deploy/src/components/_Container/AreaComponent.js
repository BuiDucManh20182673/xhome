import React, { useState, useEffect } from 'react';
import {
    Button, Typography,
    TextField,
    Card, CardHeader, CardContent, debounce,
    Divider
} from '@material-ui/core';
import { Icon } from '@mdi/react'
import { mdiCloseThick, } from '@mdi/js'
import "../../styles/scss/container/area-component.scss"
import { DialogListMaterials } from './ProductComponent'
import { ItemProduct } from '../_Common/ItemProduct'
import { TableProduct } from '../_Common/TableProduct'
import Pagination from "../_Common/PaginationComponent"
import { connect } from 'react-redux';
import * as actions from "../../constants/actionCreators"

const mapStateToProps = (state) => {
    return {
        listSelectedProduct: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteArea: (data) => {
            dispatch(actions.deleteAreaAction(data))
        },
        dropProduct: (index) => {
            dispatch(actions.dropMaterialAction(index))
        },
        openProductBoard: (index) => {
            dispatch(actions.openProductBoardAction(index))
        },
        // textNote: (text) => dispatch(actions.textNoteAction(text)),
        openFullList: (key) => {
            dispatch(actions.openListAction(key))
        },
        closeFullList: (key) => {
            dispatch(actions.closeListAction(key))
        },
        onPaginate: (num) => {
            dispatch(actions.activePageAction(num))
        },
        clearName: () => {
            dispatch(actions.clearName())
        },
        saveNote: (text) => {
            dispatch(actions.saveNote(text))
        },
        saveDescription: (text) => {
            dispatch(actions.saveDescription(text))
        },
        saveSize: (text) => {
            dispatch(actions.saveSize(text))
        },
        copyProductToArea: (data) => {
            dispatch(actions.copyProductToArea(data))
        }
    }
}

const CardArea = connect(mapStateToProps, mapDispatchToProps)((props) => {
    const [openDialogMaterials, setOpenDialogMaterials] = useState(false)
    const area = props.area;
    const displayProduct = props.displayProduct;
    const openList = props.projectReducer.openListAll
    const listArea = props.listArea
    const listIdChoosedMaterial = props.listIdChoosedMaterial
    return (

        <Card className="card-container">
            <CardHeader
                className="card-header"
                title={<Typography className="title-card-area">Khu vực: <span>{area.area}</span></Typography>}
                action={
                    <span onClick={() => props.deleteArea(props.index)}>
                        <Icon
                            path={mdiCloseThick}
                            size={0.8}
                        />
                    </span>
                }
            />
            <CardContent style={{ backgroundColor: "#f5f5f5" }} className="card-content">
                <div className="title-list-materials">
                    <span className="title-list-materials-title">Danh mục sản phẩm</span>
                    <Button
                        variant="contained"
                        className="title-list-materials-btn"
                        // onClick={() => }
                        onClick={() => {
                            // (props.widthScreen <= 768)
                            // ?
                            // props.handleScreen()
                            // :
                            // setOpenDialogMaterials(true)
                            // (props.widthScreen <= 768) ?
                            //     props.handleScreen()
                            //     :
                            props.openProductBoard(props.index)
                            setOpenDialogMaterials(true)
                        }}
                    >Chọn</Button>
                    <DialogListMaterials open={openDialogMaterials} handleClose={() => {
                        setOpenDialogMaterials(false);
                        props.clearName()

                    }} />
                </div>
                {!openList[props.index] ?
                    displayProduct.listDisplayProduct.length > 0 &&
                    displayProduct.listDisplayProduct.map((item, key) =>
                        <div key={key}>
                            <TableProduct
                                materialsByArea={true}
                                typeTable={'project-creation-area'}
                                key={key}
                                product={item}
                                areaIndex={props.index}
                                index={key}
                                beginPoint={displayProduct.beginPoint}
                                listProduct={displayProduct.listDisplayProduct}
                                activePage={displayProduct.activePage}
                                dropProduct={(index) => props.dropProduct(index)}
                                saveSize={(data) => { props.saveSize(data) }}
                                saveDescription={(data) => { props.saveDescription(data) }}
                                saveNote={(data) => { props.saveNote(data) }}
                                listArea={listArea}
                                copyProductToArea={props.copyProductToArea}
                                listIdChoosedMaterial={props.listIdChoosedMaterial}
                            />
                            <Divider />
                        </div>
                    )
                    :
                    props.listProduct.map((item, key) =>
                        <div key={key}>
                            <TableProduct
                                listArea={listArea}
                                materialsByArea={true}
                                typeTable={'project-creation-area'}
                                openList={true}
                                key={key}
                                product={item}
                                areaIndex={props.index}
                                index={key}
                                beginPoint={displayProduct.beginPoint}
                                listProduct={displayProduct.listDisplayProduct}
                                activePage={displayProduct.activePage}
                                dropProduct={(data) => props.dropProduct(data)}
                                saveSize={(data) => { props.saveSize(data) }}
                                saveDescription={(data) => { props.saveDescription(data) }}
                                saveNote={(data) => { props.saveNote(data) }}
                                copyProductToArea={props.copyProductToArea}
                                listIdChoosedMaterial={props.listIdChoosedMaterial}
                            />
                            <Divider />
                        </div>
                    )
                }
                {/* mobile screen */}
                {/* {!openList[props.index] ?
                    displayProduct.listDisplayProduct.length > 0 &&
                    displayProduct.listDisplayProduct.map((item, key) =>
                        <div key={key}>
                            <ItemProduct
                                materialsByArea={true}
                                typeTable={'project-creation-area'}
                                key={key}
                                product={item}
                                areaIndex={props.index}
                                index={key}
                                beginPoint={displayProduct.beginPoint}
                                listProduct={displayProduct.listDisplayProduct}
                                activePage={displayProduct.activePage}
                                dropProduct={(index) => props.dropProduct(index)}
                                saveSize={(data) => { props.saveSize(data) }}
                                saveDescription={(data) => { props.saveDescription(data) }}
                                saveNote={(data) => { props.saveNote(data) }}
                            />
                            <Divider />
                        </div>
                    )
                    :
                    props.listProduct.map((item, key) =>
                        <div key={key}>
                            <ItemProduct
                                materialsByArea={true}
                                typeTable={'project-creation-area'}
                                openList={true}
                                key={key}
                                product={item}
                                areaIndex={props.index}
                                index={key}
                                beginPoint={displayProduct.beginPoint}
                                listProduct={displayProduct.listDisplayProduct}
                                activePage={displayProduct.activePage}
                                dropProduct={(data) => props.dropProduct(data)}
                                saveSize={(data) => { props.saveSize(data) }}
                                saveDescription={(data) => { props.saveDescription(data) }}
                                saveNote={(data) => { props.saveNote(data) }}
                            />
                            <Divider />
                        </div>
                    )
                } */}
                {/* <ItemProduct /> */}
                <div className="note-list-materials">
                    {/* <label>
                        <span className="note-list-materials-title">Ghi chú</span>
                        <TextField className="note-list-materials-input" variant="outlined" size="small"
                        // onChange={debounce((e) => props.textNote({textNote: e.target.value, areaIndex: props.index}), 700)}
                        />
                    </label> */}
                    <div className="pagination-list-materials">
                        {/* Phân trang */}
                        {
                            !openList[props.index] &&
                            <Pagination
                                totalPage={props.totalPage}
                                activePage={props.displayProduct.activePage}
                                onPaginate={(activePage) => props.onPaginate({ number: activePage, index: props.index })}
                            />
                        }
                        {
                            //Nút hiển thị rút gọn hoặc xem hết
                            displayProduct.listDisplayProduct.length > 0 ? !openList[props.index] ?
                                <Typography align="center" className="txt-view-all"
                                    onClick={() => props.openFullList(props.index)}>Xem tất cả</Typography>
                                :
                                <Typography align="center" className="txt-view-all"
                                    onClick={() => props.closeFullList(props.index)}>Thu gọn</Typography>
                                :
                                null
                        }
                    </div>
                </div>
            </CardContent>
        </Card>

    )
})

// export {CardArea}
// export default connect(mapStateToProps,mapDispatchToProps)(CardArea)
export { CardArea }