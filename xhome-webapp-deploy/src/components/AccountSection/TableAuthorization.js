import React, { useState } from 'react'
import "../../styles/scss/account-section.scss"
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Button, TableFooter, Dialog, TextField } from '@material-ui/core'
import { connect } from "react-redux"
import { updatePermissionRequest } from "../../constants/actionCreators"
const arrTab = ["Vật liệu", "Nhà cung cấp", "Phân Khúc", "Quyển", "Sản phẩm", "Dự án"]
const arrCheckbox = ["Xem", "Thêm", "Sửa", "Xóa", "Tất cả"]

const TableAuthorization = (props) => {
    const [openDialog, setOpenDialog] = useState(false)
    const {
        listPermissionMaterial, listPermissionAgency,
        listPermissionFraction, listPermissionCatalog,
        listPermissionProduct, listPermissionProject
    } = props
    const isAdmin = JSON.parse(localStorage.getItem('UI')).isAdmin
    return (
        props.chooseAccountId !== 0 &&
        <div>
            <Table className="table-authorization">
                <TableHead style={{ padding: `${window.innerWidth <= 375 ? 10 : 20}` }}>
                    <TableRow className="row-tab">
                        <TableCell className="row-tab-name permistion-title">
                            Phân quyền
                        </TableCell>
                        <TableHeadCheckAll />
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Vật liệu</TableCell>
                        <TableCellCheckbox title="listPermissionMaterial" check={props.check} listPermission={listPermissionMaterial} />
                    </TableRow>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Nhà cung cấp</TableCell>
                        <TableCellCheckbox title="listPermissionAgency" check={props.check} listPermission={listPermissionAgency} />
                    </TableRow>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Phân Khúc</TableCell>
                        <TableCellCheckbox title="listPermissionFraction" check={props.check} listPermission={listPermissionFraction} />
                    </TableRow>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Quyển</TableCell>
                        <TableCellCheckbox title="listPermissionCatalog" check={props.check} listPermission={listPermissionCatalog} />
                    </TableRow>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Sản phẩm</TableCell>
                        <TableCellCheckbox title="listPermissionProduct" check={props.check} listPermission={listPermissionProduct} />
                    </TableRow>
                    <TableRow className="row-tab" >
                        <TableCell className="row-tab-name" >Dự án</TableCell>
                        <TableCellCheckbox title="listPermissionProject" check={props.check} listPermission={listPermissionProject} />
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {isAdmin &&
                            <TableCell style={{ textAlign: 'left' }} colSpan={3}>
                                <Button disabled={props.isAdmin} variant="contained" color="primary" onClick={() => setOpenDialog(true)}>{props.isAdmin ? "Đã là Admin" :
                                    "Chỉ định trở thành Admin"}</Button>
                            </TableCell>}

                        <TableCell colSpan={10} style={{ textAlign: 'right' }}>
                            <Button variant="contained" color="primary" onClick={() => props.updatePermission()}>Áp dụng</Button>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <div style={{ padding: '40px 50px', backgroundColor: '#3327281c', textAlign: "center" }}>
                    <p>Xác định tài khoản này sẽ trở thành 1 tài khoản Admin!</p>
                    <Button
                        color="primary"
                        variant="contained"
                        // style={{ padding: '10px 20px', backgroundColor: '#3327281c' }}
                        onClick={() => {
                            props.chooseAccountAdmin()
                            setOpenDialog(false)
                        }}
                    > Đồng ý
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: '20px' }}
                        onClick={() => setOpenDialog(false)}
                    > Hủy </Button>
                </div>
            </Dialog>
        </div>
    )
}


const TableHeadCheckAll = () => {
    return (
        <React.Fragment>
            {arrCheckbox.map((item, key) => (
                <TableCell className="cell-check-all" key={key}>
                    <label>{item}</label>
                </TableCell>
            ))}
        </React.Fragment>
    )
}

const TableCellCheckbox = (props) => {
    const { listPermission, title } = props
    return (
        <React.Fragment>
            { arrCheckbox.map((item, key) => {
                let check = key !== 4 ? listPermission[key] : listPermission.indexOf(false) === -1
                return (
                    <TableCell className="cell-checkbox" key={key}>
                        <Checkbox color="primary" checked={check}
                            onClick={() => props.check({
                                title,
                                key
                            })}
                        />
                    </TableCell>
                )
            })}
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const {
        listPermissionMaterial, listPermissionAgency,
        listPermissionFraction, listPermissionCatalog,
        listPermissionProduct, listPermissionProject,
        chooseAccountId, isAdmin
    } = state.account
    return {
        listPermissionMaterial, listPermissionAgency,
        listPermissionFraction, listPermissionCatalog,
        listPermissionProduct, listPermissionProject,
        chooseAccountId, isAdmin
    }
}

const mapDispatchToProps = (dispatch) => ({
    check: (data) => dispatch({
        type: "CHECK_PERMISSION",
        payload: data
    }),
    updatePermission: () => dispatch(updatePermissionRequest()),
    chooseAccountAdmin: () => {
        dispatch({
            type: "C_A_A"
        })
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(TableAuthorization);

