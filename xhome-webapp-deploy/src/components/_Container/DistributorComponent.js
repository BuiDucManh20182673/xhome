import { useEffect, useRef, useState } from 'react';
import {
    Container, Dialog,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiClipboardEditOutline } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import {
    getSupplierRequest, getDetailSupplierRequest, addSupplierRequest, updateSupplierRequest,
    deleteSupplierRequest, searchSupplierRequest, unmountSupplier, chooseSupplier,
    getCatalogByAgencyIdRequest
} from "../../constants/actionCreators"
import { connect } from "react-redux"
import Supplier from "../SupplierSection"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/distributor-component.scss'
import { Autocomplete } from '@material-ui/lab';
const Head = (props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell colSpan={100}>
                    <SearchComponent textSearch={props.textSearch}
                        search={(data) => data.textSearch !== "" ? props.searchDispatch({
                            textSearch: data.textSearch,
                            fractionId: props.fractionId,
                            pageIndex: data.pageIndex
                        })
                            : props.getDispatch({ fractionId: props.fractionId, pageIndex: 1 })} />
                </TableCell>
            </TableRow>
            {props.isLoading == false &&
                <TableRow className="cell-title">
                    <TableCell>
                        <div className='cell-head' style={{fontSize: 18}}> Tên nhà cung cấp </div>
                    </TableCell>
                    <TableCell >
                        <div className='cell-head' style={{fontSize: 18}}> Tên nhà phân phối </div>
                    </TableCell>
                    <TableCell >
                        <div className='cell-head' style={{fontSize: 18}}> Số điện thoại </div>
                    </TableCell>
                    <TableCell >
                        <div className='cell-head' style={{fontSize: 18}}> Email </div>
                    </TableCell>
                    <TableCell style={{ display: "flex", justifyContent: "flex-end",padding: '0.5em', fontSize: 18 }} >
                        <div className='cell-head'>Hành động</div>
                    </TableCell>
                </TableRow>
            }
        </TableHead>

    )
}
const Footer = (props) => {
    const [openModalChoose, setOpenModalChoose] = useState(false)
    const [supplier, setSupplier] = useState({
        supplier: "",
        distributor: {
            email: "",
            name: "",
            tel: ""
        }
    })
    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={100}>
                    <PaginationComponent
                        totalPage={props.totalPage}
                        activePage={props.activePage}
                        onPaginate={(pageIndex) => props.textSearch === "" ?
                            props.getDispatch({ fractionId: props.fractionId, pageIndex })
                            :
                            props.searchDispatch({
                                textSearch: props.textSearch,
                                fractionId: props.fractionId,
                                pageIndex
                            })}
                    />
                </TableCell>
            </TableRow>
            {window.location.pathname.match('supplier') &&
                <TableRow style={window.location.pathname.match("supplier")
                    && { visibility: "hidden" }} className="input-add-wrap">
                    <CellFooter property={"Nhà cung cấp"} onChange={(val) => setSupplier({ ...supplier, supplier: val })} />
                    <CellFooter property={"Nhà phân phối"} onChange={(val) => setSupplier({
                        ...supplier,
                        distributor: {
                            ...supplier.distributor,
                            name: val
                        }
                    })} />
                    <CellFooter type="number" property={"Số điện thoại"} onChange={(val) => setSupplier({
                        ...supplier,
                        distributor: {
                            ...supplier.distributor,
                            tel: val
                        }
                    })} />
                    <CellFooter property={"Email"} onChange={(val) => setSupplier({
                        ...supplier,
                        distributor: {
                            ...supplier.distributor,
                            email: val
                        }
                    })} />
                    <TableCell className="cell-btn-add" >
                        <Button variant="contained" className="btn-add--form" onClick={() => {
                            props.addDispatch({
                                data: {
                                    ...supplier,
                                    id: props.fractionId
                                }
                            })
                        }}>
                            Thêm mới
                    </Button>
                    </TableCell>
                </TableRow>
            }
            <TableRow>
                <Dialog
                    fullScreen={window.innerWidth < 600 ? true : false}
                    fullWidth={true}
                    maxWidth="lg"
                    onClose={() => setOpenModalChoose(false)}
                    open={openModalChoose}
                >
                    {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenModalChoose(false)}
                        style={{
                            width: '30%',
                            'position': 'fixed',
                            'bottom': 0,
                            'left': 5,
                            zIndex: 1000
                        }}
                    >Vật liệu</Button> */}
                    <Supplier setOpenModalChoose={setOpenModalChoose} onChoose={(data) => {
                        props.addDispatch({
                            data: {
                                id: props.fractionId,
                                supplier: data.supplier,
                                distributor: {
                                    name: data.name,
                                    tel: data.tel,
                                    email: data.email
                                }
                            }
                        })
                        setOpenModalChoose(false)
                    }} />
                </Dialog>
                <Button
                    variant="contained"
                    onClick={() => setOpenModalChoose(true)}
                    color={window.innerWidth <= 768 ? "primary" : "inherit"}
                    style={window.innerWidth <= 768 ? {
                        width: '100%',
                        'position': 'fixed',
                        'bottom': 0,
                        'left': 0,
                        zIndex: 1000,
                        borderRadius: 0,
                        color: 'whitesmoke'
                    } : null}
                >Thêm Nhà Cung Cấp</Button>
            </TableRow>
        </TableFooter>
    )
}
const DistributorComponent = (props) => {
    useEffect(() => {
        if (window.location.pathname.match("supplier")) {
            props.getDispatch({ fractionId: props.fractionId, pageIndex: 1 });
            props.unMount();
        }
    }, [])


    const Body = () => {
        return (
            <TableBody>
                {props.listData.map((item, idx) => {
                    return <Item
                        key={idx}
                        item={item}
                        updateDispatch={(data) => props.updateDispatch({ data, fractionId: props.fractionId })}
                        deleteDispatch={(id) => props.deleteDispatch({ id, fractionId: props.fractionId })}
                        handleShowCatalog={(data) => props.handleShowCatalog(data)}
                        chooseDispatch={(id) => props.chooseDispatch(id)}
                        setSupplierId={(id) => props.setSupplierId(id)}
                    />
                })}
            </TableBody>
        )
    }

    return (
        <div className="my-table distributor-component">
            <Container>

                <Table>
                    <Head {...props} />
                    {props.isLoading
                        ?
                        <TableCell colSpan={100}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img width="30%" src={loadImg} />
                            </div>
                        </TableCell>
                        :
                        props.listData.length > 0 && <Body />
                    }
                    <Footer {...props} />
                </Table>


            </Container>
        </div >
    )
}

const Item = (props) => {
    const [supplier, setSupplier] = useState({
        supplier: "",
        distributors: [{
            name: "",
            tel: 0,
            email: ""
        }]
    })
    const [isEditing, setIsEditing] = useState(false);
    const { updateDispatch, deleteDispatch } = props
    function select(e) {
        if (window.location.pathname.match("material")) {
            props.handleShowCatalog(supplier.supplier);
            props.chooseDispatch(supplier.id);
            props.setSupplierId(supplier.id)
        }
    }
    const setSupplierState = (attName, value) => {
        if (attName === "supplier") {
            setSupplier({ ...supplier, supplier: value })
        } else {
            setSupplier({
                ...supplier, distributor: {
                    ...supplier.distributor,
                    [attName]: value
                }
            })
        }
    }
    useEffect(() => {
        setSupplier(props.item)
    }, [props.item])
    let properties = {
        supplier, setSupplierState, updateDispatch, deleteDispatch,
        isEditing, setIsEditing, select
    }
    return (
        <>
            {
                !isEditing
                    ? <RowContent properties={properties} />
                    : <RowInput properties={properties} />
            }
        </>
    )
}

const RowContent = (props) => {
    const {
        supplier, setIsEditing, deleteDispatch,
        select
    } = props.properties
    const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
    return (
        <TableRow className={'my-row row-content'}>
            <CellContent className="cell-name" property={supplier.supplier} select={select} />
            <CellContent className="cell-name" property={supplier.distributors.length > 0 && supplier.distributors[0].name} select={select} />
            { isAdmin ? <CellContent className="cell-number" property={supplier.distributors.length > 0 && supplier.distributors[0].tel} select={select} /> : <CellContent className="cell-number" property={"Không có quyền"} select={select} />}
            { isAdmin ? <CellContent className="cell-email" property={supplier.distributors.length > 0 && supplier.distributors[0].email} select={select} /> : <CellContent className="cell-email" property={"Không có quyền"} select={select} />}
            <TableCell className="cell cell-action" >
                <div className="btn-wrap">
                    {/* <Button className={'btn btn-edit'}
                        onClick={(e) => {
                            setIsEditing(true)
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button> */}
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Xác nhận nhà cung cấp ${supplier.supplier}!`)) {
                            deleteDispatch(supplier.id)
                        }
                    }}>
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
function useOnClickOutside(ref, handler) {
    useEffect(
        () => {
            const listener = event => {
                // Do nothing if clicking ref's element or descendent elements
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }

                handler(event);
            };

            document.addEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);

            return () => {
                document.removeEventListener('mousedown', listener);
                document.removeEventListener('touchstart', listener);
            };
        },
        // Add ref and handler to effect dependencies
        // It's worth noting that because passed in handler is a new ...
        // ... function on every render that will cause this effect ...
        // ... callback/cleanup to run every render. It's not a big deal ...
        // ... but to optimize you can wrap handler in useCallback before ...
        // ... passing it into this hook.
        [ref, handler]
    );
}
const RowInput = (props) => {

    const clickOutSide = useRef(null)
    const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
    const {
        supplier, setSupplierState, updateDispatch, deleteDispatch,
        isEditing, setIsEditing,
        select } = props.properties
    useOnClickOutside(clickOutSide, () => setIsEditing(false));
    return (
        <TableRow ref={clickOutSide} className={'my-row row-input'}>
            <CellInput className="cell-name" property={supplier.supplier} method={(val) => setSupplierState("supplier", val)} />
            <CellInput className="cell-name" property={supplier.distributors.length > 0 ? supplier.distributors[0].name : ""} method={(val) => setSupplierState("name", val)} />
            { isAdmin ? <CellInput className="cell-number" property={supplier.distributors.length > 0 ? supplier.distributors[0].tel : ""} method={(val) => setSupplierState("tel", val)} /> : <CellContent className="cell-number" property={""} select={select} />}
            { isAdmin ? <CellInput className="cell-email" property={supplier.distributors.length > 0 ? supplier.distributors[0].email : ""} method={(val) => setSupplierState("email", val)} /> : <CellContent className="cell-email" property={""} select={select} />}
            <TableCell className="cell cell-action" >
                <div className="btn-wrap">
                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => {
                            // setIsEditing(false);
                            updateDispatch(supplier);
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Xác nhận nhà cung cấp ${supplier.supplier}!`)) {
                            deleteDispatch(supplier.id)
                        }
                    }}>
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
const CellContent = (props) => {
    const { property, select } = props
    return (
        <TableCell className={`cell ${props.className}`}>
            <div className="cell-inner">
                <Button className="btn-toggle"
                    onClick={(e) => {
                        select(e.target)
                    }}
                > {property} </Button>
            </div>
        </TableCell>
    )
}
const CellInput = (props) => {
    const { property, method, type } = props
    return (
        <TableCell className={"cell"} >
            <div className="cell-inner">
                {type && type === "number" ?
                    <Input
                        className="isEditing"
                        type="number"
                        value={property}
                        onChange={(e) => method(e.target.value)}
                        autoFocus />
                    :
                    <Input
                        className="isEditing"
                        value={property}
                        onChange={(e) => method(e.target.value)}
                        autoFocus />}
            </div>
        </TableCell>
    )
}
const CellFooter = (props) => {
    return (
        <TableCell className="cell-input-add" >
            {
                props.type && props.type === "number"
                    ?
                    <Input type="number" className="input-add" placeholder={props.property} onChange={(e) => props.onChange(e.target.value)} />
                    :
                    <Input className="input-add" placeholder={props.property} onChange={(e) => props.onChange(e.target.value)} />
            }
        </TableCell>
    )
}

const mapStateToProps = (state) => {
    const { listData, activePage, totalPage, textSearch, isLoading } = state.supplier
    return {
        listData, activePage, totalPage, textSearch, isLoading
    }
}

const mapDispatchToProps = (dispatch) => ({
    getDispatch: (data) => {
        dispatch(getSupplierRequest(data))
    },
    updateDispatch: (data) => {
        dispatch(updateSupplierRequest(data))
    },
    deleteDispatch: (id) => {
        dispatch(deleteSupplierRequest(id))
    },
    addDispatch: (data) => {
        dispatch(addSupplierRequest(data))
    },
    searchDispatch: (data) => {
        dispatch(searchSupplierRequest(data))
    },
    unMount: () => {
        dispatch(unmountSupplier())
    },
    chooseDispatch: (id) => {
        dispatch(chooseSupplier(id));
        dispatch(getCatalogByAgencyIdRequest(1))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DistributorComponent);