import React, { useState, useEffect } from 'react';
import {
    Button, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@material-ui/core';
import { ItemProduct } from '../_Common/ItemProduct'
import { TableMaterial } from '../_Common/TableMaterial'
import Pagination from "../_Common/PaginationComponent"
import "../../styles/scss/container/product-selected-component.scss"
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
    return {
        areaIndex: state.projectReducer.activeArea,
        project: state.projectReducer.project
    }
}


const DialogSelectMaterials = connect(mapStateToProps, null)(
    (props) => {
        return (
            <Dialog
                className="dialog-container dialog-container-select-materials"
                fullWidth={true}
                maxWidth="md"
                open={props.open}
                fullScreen={window.innerWidth < 600 ? true : false}
            >
                <DialogTitle className="dialog-title-select">
                    <label className="dialog-title-select-head">
                        <Typography className="txt-head" variant="h6">Vật liệu đã chọn</Typography>
                        <Typography className="txt-head" variant="h6"> ({props.project.areas[props.areaIndex].area}) </Typography>
                    </label>
                </DialogTitle>
                <DialogContent className="dialog-content-select">
                    <TableMaterial
                        {...props}
                        selectedMaterial={true}
                        typeTable="selectedData"
                    />
                </DialogContent>
                <DialogActions className="dialog-actions-select">
                    {/* <Button onClick={() => props.handleClose()} variant="contained" >Quay lại</Button> */}
                    {/* <Pagination /> */}
                    <Button className="btn-complete" onClick={() => props.handleClose()} variant="contained">Xong</Button>
                </DialogActions>
            </Dialog>
        )
    }
)

const SelectedMaterialMobile = () => {
    return (
        <div className="container-selected-material-mobile">
            <ItemProduct />
            <ItemProduct />
            <ItemProduct />
            <ItemProduct />
            <ItemProduct />
            <ItemProduct />
            <ItemProduct />
        </div>
    )
}

export { DialogSelectMaterials, SelectedMaterialMobile }