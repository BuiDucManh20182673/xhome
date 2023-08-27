import { useEffect, useState, useRef } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, OutlinedInput
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiPlus, mdiClipboardEditOutline } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import {
    getSupplierNameRequest, getDetailSupplierRequest, addSupplierNameRequest, updateSupplierRequest,
    deleteSupplierRequest, searchSupplierNameRequest, chooseSupplierName, getDistributorBySupNameRequest,
    updateSupplierNameAllRequest, deleteSupplierNameAllRequest
} from "../../constants/actionCreators"
import { connect } from "react-redux"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"

import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/supplier-component.scss'

const Head = (props) => {
    return (
        <TableHead className="my-table supplier-component">
            <TableRow>
                <TableCell colSpan={100}>
                    <SearchComponent search={(data) => data.textSearch === "" ?
                        props.getDispatch(1) : props.searchDispatch(data)} />
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

const SupplierComponent = (props) => {
    useEffect(() => {
        props.getDispatch(1);
    }, [])


    const Body = () => {

        return (
            <TableBody>
                {props.listData.map((item, idx) => {
                    return <Item
                        key={idx}
                        item={item}
                        updateDispatch={props.updateDispatch}
                        deleteDispatch={props.deleteDispatch}
                        chooseSupplierName={props.chooseSupplierName}
                        choosedName={props.choosedName}
                        // scrollToBottom={props.scrollToBottom}
                        openTabMaterial={() => props.openTabMaterial()}

                    />
                })}
            </TableBody>
        )
    }

    const Footer = () => {
        const [name, setName] = useState("")
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent
                            totalPage={props.totalPage}
                            activePage={props.activePage}
                            onPaginate={(pageIndex) => props.textSearch === "" ? props.getDispatch(pageIndex) : props.searchDispatch({
                                textSearch: props.textSearch,
                                pageIndex
                            })}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        <OutlinedInput
                            className="add-input"
                            placeholder="Thêm Nhà cung cấp"
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && props.addDispatch({ supplier: name })}
                            endAdornment={
                                <Button className="add-btn" onClick={() => {
                                    props.addDispatch({ supplier: name })
                                }}>
                                    <Icon path={mdiPlus} size={1} />
                                </Button>
                            } />
                    </TableCell>
                </TableRow>
            </TableFooter>
        )
    }
    return (
        <div className="my-table supplier-component">
            <Container>
                <Table>
                    <Head searchDispatch={props.searchDispatch} getDispatch={props.getDispatch} />
                    {props.isLoading
                        ?
                        <TableCell colSpan={100}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img width="30%" src={loadImg} />
                            </div>
                        </TableCell>
                        :
                        props.listData.length > 0 && <Body />}
                    <Footer />
                </Table>
            </Container>
        </div>
    )
}

const Item = (props) => {
    const [item, setItem] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    function select(name) {
        props.chooseSupplierName(name)
        // props.scrollToBottom()
    }
    useEffect(() => {
        setItem(props.item)
    }, [props.item])
    let properties = { item, setItem, isEditing, setIsEditing, select }
    return (
        <>
            {
                !isEditing
                    ? <RowContent properties={properties}
                        deleteDispatch={(id) => props.deleteDispatch(id)}
                        choosedName={props.choosedName}
                        openTabMaterial={() => props.openTabMaterial()}
                    />
                    : <RowInput properties={properties}
                        updateDispatch={(data) => props.updateDispatch(data)}
                        deleteDispatch={(id) => props.deleteDispatch(id)}
                    />
            }
        </>
    )
}

const RowContent = (props) => {
    const {
        item,
        setItem, setIsEditing,
        select
    } = props.properties
    return (
        <TableRow className={props.choosedName === item.name ? 'my-row row-content selected' : 'my-row row-content'}>
            <TableCell className="cell cell-name" width={"70%"}>
                <div className="cell-inner">
                    <Button className="btn-toggle"
                        onClick={(e) => {
                            select(item.name)
                            props.openTabMaterial()
                        }}
                    > {item.name} </Button>
                </div>
            </TableCell>
            <TableCell className="cell cell-action" width={"30%"}>
                <div className="btn-wrap">
                    <Button className={'btn btn-edit'}
                        onClick={(e) => {
                            setIsEditing(true)

                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete">
                        <Icon path={mdiDelete} size={1}
                            onClick={() => {
                                if (window.confirm(`Xác nhận xóa nhà cung cấp ${item.name}!`)) {
                                    props.deleteDispatch({ supplier: item.name })
                                }
                            }}
                        />
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
    const { item, isEditing, setItem, setIsEditing, select } = props.properties
    const [oldSupplier, setOldSupplier] = useState("")
    useEffect(() => setOldSupplier(item.name), [])
    useOnClickOutside(clickOutSide, () => setIsEditing(false));
    return (
        <TableRow ref={clickOutSide} className={'my-row row-input'}>
            <TableCell className="cell cell-name" width={"70%"}>
                <div className="cell-inner">
                    <Input
                        className="isEditing"
                        value={item.name}
                        onChange={(e) => setItem({ ...item, name: e.target.value })}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setIsEditing(false);
                                props.updateDispatch({
                                    oldSupplier,
                                    newSupplier: item.name
                                });
                            }
                        }}
                        autoFocus />
                </div>
            </TableCell>
            <TableCell className="cell cell-action" width={"30%"}>
                <div className="btn-wrap">
                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => {
                            setIsEditing(false);
                            props.updateDispatch({
                                oldSupplier,
                                newSupplier: item.name
                            });
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete">
                        <Icon path={mdiDelete} size={1}
                            onClick={() => {
                                if (window.confirm(`Xác nhận xóa nhà cung cấp ${oldSupplier}!`)) {
                                    props.deleteDispatch({ supplier: oldSupplier })
                                }
                            }}
                        />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}

const mapStateToProps = (state) => {
    const { listDataName, activePageName, totalPageName, textSearchName, choosedName, isLoading } = state.supplier
    return {
        listData: listDataName,
        activePage: activePageName,
        totalPage: totalPageName,
        textSearch: textSearchName,
        choosedName, isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDispatch: (pageIndex) => {
            dispatch(getSupplierNameRequest(pageIndex))
        },
        updateDispatch: (data) => {
            dispatch(updateSupplierNameAllRequest(data))
        },
        deleteDispatch: (id) => {
            dispatch(deleteSupplierNameAllRequest(id))
        },
        addDispatch: (data) => {
            dispatch(addSupplierNameRequest(data))
        },
        searchDispatch: (data) => {
            dispatch(searchSupplierNameRequest(data))
        },
        chooseSupplierName: (data) => {
            dispatch(chooseSupplierName(data));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SupplierComponent);
