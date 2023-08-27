import { useEffect, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, OutlinedInput, TextField, Typography,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, debounce
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiPlus, mdiEye, mdiClipboardEditOutline, mdiClose } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/material-component.scss'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"

import * as actions from '../../constants/actionCreators'
import { connect } from 'react-redux';
// import Icon from '@mdi/react'
import { mdiMagnify } from '@mdi/js';
import '../../styles/scss/common/search-component.scss'

const mapStateToPropsAccount = (state) => {
    return {
        listAccount: state.account.listAccount,
        totalPage: state.account.totalPage,
        activePage: state.account.activePage,
        textSearch: state.account.textSearch,
        isLoading: state.account.isLoading,
        chooseId: state.account.chooseAccountId
    }
}

const mapDisptachToPropsAccount = (dispatch) => {

    return ({
        getAccount: (data) => {
            dispatch(actions.getAccount(data))
        },
        getSearchAccount: (data) => {
            dispatch(actions.getSearchAccount(data))
        }
    })
}
const MaterialComponent = connect(mapStateToPropsAccount, mapDisptachToPropsAccount)((props) => {
    useEffect(() => props.getAccount({ activePage: 1 }), [])
    const Head = () => {
        return (
            <TableHead >
                <TableRow>
                    <TableCell colSpan={100}>
                        {/* chinh lai search  */}
                        <OutlinedInput
                            className="search-input"
                            placeholder="Tìm kiếm"
                            defaultValue={props.textSearch}
                            onChange={
                                debounce((e) => {
                                    props.getSearchAccount({
                                        textSearch: e.target.value,
                                        activePage: 1
                                    })
                                    if (e.target.value === '') {
                                        props.getAccount({ activePage: 1 })
                                    }

                                }, 700)}

                            autoFocus={window.innerWidth > 768 ? true : false}
                            endAdornment={
                                <Button
                                    variant="contained"
                                    className="search-btn"
                                >
                                    <Icon path={mdiMagnify} size={1} />
                                </Button>
                            }
                        />
                    </TableCell>
                </TableRow>
            </TableHead>

        )
    }


    const Body = () => {
        let mockupArr = []
        if (props.listAccount.rows) {
            mockupArr = props.listAccount.rows.map((item, idx) => {
                return <Item
                    scrollToBottom={props.scrollToBottom}
                    {...props}
                    key={idx}
                    item={item}
                    openTabMaterial={() => props.openTabMaterial(true)}
                />
            })
        }
        return (
            <TableBody>
                {mockupArr}
            </TableBody>
        )
    }

    const Footer = () => {
        const [showModal, setShowModal] = useState(false)
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent
                            // {...props}
                            totalPage={props.totalPage}
                            activePage={props.activePage}
                            onPaginate={(activePage) => {
                                if (props.textSearch === '') {
                                    props.getAccount({ activePage: activePage })
                                } else {
                                    props.getSearchAccount({ activePage: activePage, textSearch: props.textSearch })
                                }
                            }}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        <Button variant="outlined" color="primary"
                            onClick={() => { setShowModal(true) }}
                        >
                            Thêm tài khoản
                            {/* <Icon path={mdiPlus} size={1} /> */}
                        </Button>
                    </TableCell>
                </TableRow>
                <ModalAddAccount
                    open={showModal}
                    handleClose={() => setShowModal(false)}
                    type='add'
                />
            </TableFooter>
        )
    }
    return (
        <div className="my-table material-component">
            <Container>
                <Table>
                    <Head />
                    {props.isLoading ?
                        <TableCell colSpan={100}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img style={{ width: "30%" }} src={loadImg} alt="loading" />
                            </div>
                        </TableCell>
                        :

                        <Body />


                    }
                    <Footer />
                </Table>
            </Container>
        </div>
    )
})

const Item = (props) => {
    const [name, setName] = useState('')
    const [account, setAccount] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    function select(e) {
        let a = document.getElementsByClassName('selected')
        let selectedItem = e.closest('tr')
        if (a.length > 0) {
            a[0].classList.remove("selected")
        }
        selectedItem.classList.add('selected')
    }
    useEffect(() => {
        setName(props.item.name)
        setAccount(props.item.account)
    }, [props.item])
    let properties = props.item
    return (
        <>
            {
                !isEditing
                    ? <RowContent {...props} properties={properties} scrollToBottom={props.scrollToBottom}
                        openTabMaterial={() => props.openTabMaterial(true)} />
                    : <RowInput properties={properties} />
            }
        </>
    )
}

const mapDisptachToPropsAccountDelete = (dispatch) => {

    return ({
        deleteAccount: (data) => {
            dispatch(actions.deleteAccount(data))
        },
        chooseAccountPermission: (payload) => {
            dispatch({
                type: "CHOOSE_ACCOUNT_PERMISSION",
                payload
            })
        }
    })
}

const RowContent = connect(mapStateToPropsAccount, mapDisptachToPropsAccountDelete)((props) => {
    const {
        fullName, isEditing, id, isAdmin,
        setFullName, setIsEditing,
        select, username, permission
    } = props.properties
    const [showModal, setShowModal] = useState(false)
    return (
        <TableRow className={props.chooseId === id ? 'my-row row-content selected' : 'my-row row-content'}>
            <TableCell className="cell cell-name" width={"35%"}>
                <div className="cell-inner">
                    <Button className="btn-toggle"> {fullName} </Button>
                </div>
            </TableCell>
            <TableCell className="cell cell-account" width={"35%"}>
                <div className="cell-inner">
                    <Button className="btn-toggle"> {username} </Button>
                </div>
            </TableCell>
            <TableCell className="cell cell-action" width={"30%"}>
                <div className="btn-wrap">
                    <Button
                        className="btn btn-delete"
                        onClick={() => {
                            // props.scrollToBottom()
                            props.chooseAccountPermission({permission, isAdmin})
                            props.setUser(props.properties)
                            props.openTabMaterial();
                        }
                        }
                    >
                        <Icon path={mdiEye} size={1} />
                    </Button>
                    <Button className={'btn btn-edit'}
                        onClick={(e) => {
                            // setIsEditing(true)
                            setShowModal(true)
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete"
                        onClick={() => {
                            if (window.confirm(`Xác nhận xóa tài khoản ${fullName}!`)) {
                                props.deleteAccount({
                                    id: props.properties.id,
                                    textSearch: props.textSearch,
                                    activePage: props.activePage
                                })
                            }
                        }}
                    >
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
            <ModalAddAccount
                {...props}
                open={showModal}
                handleClose={() => setShowModal(false)}
                type='update'
            />
        </TableRow >
    )
})

const RowInput = (props) => {
    const { name, isEditing, setName, setIsEditing, select } = props.properties
    return (
        <TableRow className={'my-row row-input'}>
            <TableCell className="cell cell-name" width={"35%"}>
                <div className="cell-inner">
                    <Input
                        className="isEditing"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus />
                </div>
            </TableCell>
            <TableCell className="cell cell-name" width={"35%"}>
                <div className="cell-inner">
                    <Input
                        className="isEditing"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus />
                </div>
            </TableCell>
            <TableCell className="cell cell-action" width={"30%"}>
                <div className="btn-wrap">
                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => { setIsEditing(false) }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete">
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
export default MaterialComponent;


const mapDisptachToPropsAccountChange = (dispatch) => {

    return ({
        postAccount: (data) => {
            dispatch(actions.postAccount(data))
        },
        putAccount: (data) => {
            dispatch(actions.putAccount(data))
        }
    })
}

const ModalAddAccount = connect(mapStateToPropsAccount, mapDisptachToPropsAccountChange)((props) => {
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');
    const [passAgain, setPassAgain] = useState('');
    return (
        <Dialog
            open={props.open}
            className="dialog-container"
        >
            <DialogTitle className="dialog-title">
                <Typography style={{ fontWeight: 'bold' }}>
                    {
                        props.type === "update"
                            ?
                            props.properties.fullName
                            :
                            "Thêm Mới"
                    }
                </Typography>
                <Icon
                    className="btn-close"
                    path={mdiClose} size={1}
                    onClick={() => props.handleClose()}
                />
            </DialogTitle>
            <DialogContent className="dialog-content">
                <Typography style={{ fontSize: '14px', color: 'gray', margin: '15px 0px 5px 0px' }}>Tên Tài khoản</Typography>
                <TextField style={{ width: '250px' }} variant="outlined" size="small" defaultValue={
                    props.type === "update"
                        ?
                        props.properties.fullName
                        :
                        ""
                }
                    onChange={(e) => { setFullName(e.target.value) }}
                />
                <Typography style={{ fontSize: '14px', color: 'gray', margin: '15px 0px 5px 0px' }}> Tên Đăng Nhập </Typography>
                <TextField style={{ width: '250px' }} variant="outlined" size="small" defaultValue={
                    props.type === "update"
                        ?
                        props.properties.username
                        :
                        ""
                }
                    onChange={(e) => { setUserName(e.target.value) }}
                />
                {
                    props.type === "update"
                        ?
                        ""
                        :
                        <div>
                            <Typography style={{ fontSize: '14px', color: 'gray', margin: '15px 0px 5px 0px' }}>Nhập mật khẩu</Typography>
                            <TextField type="password" style={{ width: '250px' }} variant="outlined" size="small"
                                onChange={(e) => { setPass(e.target.value) }}
                            />
                            <Typography style={{ fontSize: '14px', color: 'gray', margin: '15px 0px 5px 0px' }}>Nhập lại mật khẩu</Typography>
                            <TextField type="password" style={{ width: '250px' }} variant="outlined" size="small"
                                onChange={(e) => { setPassAgain(e.target.value) }}
                            />
                        </div>
                }
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button style={{ width: '100%', margin: '5px 15px' }} variant="contained" color="primary"
                    onClick={() => {
                        if (props.type === "update") {
                            props.putAccount({
                                id: props.properties.id,
                                fullName: fullName === '' ? props.properties.fullName : fullName,
                                userName: userName === '' ? props.properties.username : userName,
                                activePage: props.activePage,
                                textSearch: props.textSearch
                            })
                        } else {
                            if (pass === passAgain) {
                                props.postAccount({
                                    fullName: fullName,
                                    userName: userName,
                                    passWord: pass,
                                    activePage: props.activePage,
                                    textSearch: props.textSearch
                                })
                            } else {
                                alert("Nhập mật khẩu không trùng")
                            }
                        }
                    }}
                >
                    {
                        props.type === "update"
                            ?
                            "Sửa"
                            :
                            "Tạo"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    )
}
)