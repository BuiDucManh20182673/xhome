import React, { useState, useEffect } from 'react'
import { Card, CardActions, TableRow, TableCell, Button, TableBody, Table, Typography, TableHead, CardContent, TableFooter, TableContainer } from '@material-ui/core'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import Pagination from "../_Common/PaginationComponent"
import { makeStyles } from '@material-ui/core/styles';
import PaginationComponent from '../_Common/PaginationComponent'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from 'react-redux';
import * as actions from "../../constants/actionCreators"
import { DialogAddNewProduct } from '../_Common/ModalProduct'
const useStyles = makeStyles({
    root: {
        minWidth: 265,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    'row:hover': {
        opacity: 0
    }
});
export function SimpleCard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    let arrAtt = []
    for (const key in props.data) {
        if (props.data.hasOwnProperty(key)) {
            arrAtt.push({
                att: key,
                val: props.data[key]
            });
        }
    }
    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h5" component="h2">
                    {props.title}
                </Typography>
                <br />
                {arrAtt.map((item, idx) => item.att !== "id" && (
                    (item.val && typeof item.val !== "object") && (!item.val.match("http") ?
                        <Typography key={idx} className={classes.pos} color="textSecondary">
                            {item.val}
                        </Typography>
                        :
                        <img style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover"
                        }} src={item.val} />
                    )))}
            </CardContent>
        </Card>
    );
}

const mapState = (state) => {
    return {
        listPending: state.listPendingReducer.listData,
        isLoading: state.listPendingReducer.isLoading,
        activePage: state.listPendingReducer.activePage,
        totalPage: state.listPendingReducer.totalPage
    }
}
const mapDispatch = (dispatch) => {
    return {
        getListPending: (activePage) => {
            dispatch(actions.getListPending(activePage))
        },
        pendingAction: (payload) => {
            dispatch({
                type: "HANDLE_RQ_REQUEST",
                payload
            })
        }
    }
}

const DialogRq = (props) => {
    const { open, setOpen, objChoose } = props
    let { params, originalData } = objChoose
    let oldParams = {}
    if (originalData) {
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                oldParams = { ...oldParams, [key]: originalData[key] }
            }
        }
    } else {
        if(objChoose.action === 'UPDATE_AGENCY'){
            oldParams = {
                oldSupplier: params.oldSupplier
            }
            params = {
                newSupplier: params.newSupplier
            }
        }else{
            oldParams = null
        }
    }

    return <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
    >
        {(
            objChoose.action !== 'ADD_PRODUCT' &&
            objChoose.action !== 'ADD_FULL_PRODUCT')
            ?
            <div>
                <DialogTitle id="form-dialog-title">{objChoose.action}</DialogTitle>
                <DialogContent style={{
                    display: "inline-flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    {oldParams && <SimpleCard title="Cũ" data={oldParams} />}
                    <SimpleCard title="Mới" data={params} />
                </DialogContent>
                <DialogActions>
                    {JSON.parse(localStorage.getItem("UI")).isAdmin && objChoose.status === "PENDING" ?
                        <>
                            <Button variant="outlined" color="primary" onClick={() => {
                                setOpen(false)
                                props.pendingAction({
                                    id: objChoose.id,
                                    accept: true
                                })
                            }}>
                                Duyệt
                    </Button>
                            <Button variant="outlined" color="secondary" onClick={() => {
                                setOpen(false)
                                props.pendingAction({
                                    id: objChoose.id,
                                    accept: false
                                })
                            }}>
                                Từ chối
                    </Button>
                        </>
                        :
                        <Button variant="outlined" color="secondary" onClick={() => setOpen(false)}>Đóng</Button>
                    }

                </DialogActions>
            </div>
            :
            <DialogAddNewProduct
                {...props}
                open={open}
                handleClose={() => setOpen(false)}
            />
        }
    </Dialog>
}

const convertDate = (dateBE) => {
    let date = new Date(dateBE);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    let hour = date.getHours()
    let minute = date.getMinutes()

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    let converted = hour + ":" + minute + " - " + dt + '/' + month + '/' + year

    return converted
}

const ItemCategoryPending = connect(mapState, mapDispatch)((props) => {
    const [open, setOpen] = React.useState(false);
    const [objChoose, setObjChoose] = React.useState({});
    useEffect(() => props.getListPending(1), [])
    const header = {
        padding: '15px',
        fontWeight: 'bold',
        backgroundColor: 'whitesmoke',
        fontSize: '1.3rem',
    }
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow className="cell-title">
                        <TableCell style={header}>Trạng Thái</TableCell>
                        <TableCell style={header}>Hành động</TableCell>
                        {
                            JSON.parse(localStorage.getItem('UI')).isAdmin === 1
                            &&
                            <TableCell style={header}>Người tạo</TableCell>
                        }
                        <TableCell style={header}>Yêu cầu lúc</TableCell>
                    </TableRow>
                </TableHead>
                {props.isLoading ?
                    <TableBody>
                        <TableCell colSpan={100}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img width="20%" src={loadImg} />
                            </div>
                        </TableCell>
                    </TableBody>
                    :
                    <TableBody>
                        {/* map dữ liệu từ đây */}
                        {props.listPending.map((item, key) => (
                            <TableRow key={key} onClick={() => {
                                setObjChoose(item)
                                setOpen(true)
                            }}>
                                <TableCell style={{ color: item.status === "PENDING" ? 'blue' : (item.status === "SUCCESS" ? 'green' : 'red') }}>{item.status}</TableCell>
                                <TableCell>{item.action}</TableCell>
                                {
                                    JSON.parse(localStorage.getItem('UI')).isAdmin === 1
                                    &&
                                    <TableCell>{item["account.fullName"]}</TableCell>
                                }
                                <TableCell>{convertDate(item.updated_at)}</TableCell>
                            </TableRow>
                        ))}
                        <DialogRq setOpen={setOpen} open={open} objChoose={objChoose} pendingAction={props.pendingAction} />
                    </TableBody>
                }
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={100}>
                            <PaginationComponent activePage={props.activePage} totalPage={props.totalPage}
                                onPaginate={(pageIdx) => props.getListPending(pageIdx)} />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>

        </TableContainer >

    )
})
export default ItemCategoryPending;