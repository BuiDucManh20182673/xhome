import { useEffect, useRef, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, OutlinedInput
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiPlus, mdiClipboardEditOutline } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"

import {
    getMaterialRequest, addMaterialRequest, updateMaterialRequest, unmountSupplier,
    deleteMaterialRequest, searchMaterialRequest, getFractionRequest, chooseMaterial
} from "../../constants/actionCreators"
import { connect } from "react-redux"
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/material-component.scss'
const Head = (props) => {
    return (

        <TableHead >
            <TableRow>
                <TableCell colSpan={100}>
                    <SearchComponent textSearch={props.textSearch}
                        search={(data) => data.textSearch !== "" ? props.searchDispatch(data) : props.getDispatch(1)} />
                </TableCell>
            </TableRow>
        </TableHead>

    )
}
const MaterialComponent = (props) => {
    useEffect(() => {
        props.getDispatch(1);
        props.unmountSupplierDispatch();
    }, [])

    const Body = () => {

        return (
            <TableBody>
                {props.listData.map((item, idx) => {
                    return <Item
                        chooseId={props.chooseId}
                        key={idx}
                        item={item}
                        updateDispatch={(data) => props.updateDispatch(data)}
                        deleteDispatch={(id) => props.deleteDispatch(id)}
                        chooseDispatch={() => props.chooseDispatch(item.id)}
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
                {
                    window.location.pathname.match("material") &&
                    <TableRow>
                        <TableCell colSpan={100}>
                            <OutlinedInput
                                className="add-input"
                                placeholder="Thêm vật liệu"
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && props.addDispatch({ name: name })}
                                endAdornment={
                                    <Button className="add-btn" onClick={() => {
                                        props.addDispatch({ name: name })
                                    }}>
                                        <Icon path={mdiPlus} size={1} />
                                    </Button>
                                } />
                        </TableCell>
                    </TableRow>
                }
            </TableFooter>
        )
    }
    return (
        <div className="my-table material-component">
            <Container >
                <div style={{
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '3px',
                    padding: '10px',
                }}>
                    <Table>
                        <Head {...props} />
                        {props.isLoading ?
                            <TableCell colSpan={100}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img style={{ width: "70%" }} src={loadImg} alt="loading" />
                                </div>
                            </TableCell>
                            :

                            <Body />


                        }
                        <Footer />
                    </Table>
                </div>
            </Container>
        </div>
    )
}

const Item = (props) => {
    const [item, setItem] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    function select(e) {
        props.chooseDispatch();
        // props.scrollToBottom();
    }
    useEffect(() => {
        setItem(props.item)
    }, [props.item])
    let properties = { item, setItem, isEditing, setIsEditing, select }
    return (
        <>
            {
                !isEditing
                    ? <RowContent chooseId={props.chooseId} properties={properties}
                        deleteDispatch={(id) => props.deleteDispatch(id)}
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
        // setItem, 
        setIsEditing,
        select
    } = props.properties
    return (
        <TableRow className={props.chooseId === item.id ? 'my-row row-content selected' : 'my-row row-content'}>
            <TableCell className="cell cell-name" width={"70%"}>
                <div className="cell-inner">
                    <Button className="btn-toggle"
                        onClick={(e) => {
                            select(e.target)
                            props.openTabMaterial()
                        }}
                    > {item.name} </Button>
                </div>
            </TableCell>
            {
                window.location.pathname.match("material") &&
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
                                    if (window.confirm(`Xác nhận xóa vật liệu ${item.name}!`)) {
                                        props.deleteDispatch(item.id)
                                    }
                                }}
                            />
                        </Button>
                    </div>
                </TableCell>
            }

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
    const { item, setItem, setIsEditing } = props.properties
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
                                props.updateDispatch(item);
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
                            props.updateDispatch(item);
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete">
                        <Icon path={mdiDelete} size={1}
                            onClick={() => {
                                if (window.confirm(`Xác nhận xóa vật liệu ${item.name}!`)) {
                                    props.deleteDispatch(item.id)
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
    const { listData, activePage, totalPage, textSearch, chooseId, isLoading } = state.material
    return {
        listData, activePage, totalPage, textSearch, chooseId, isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDispatch: (pageIndex) => {
            dispatch(getMaterialRequest(pageIndex))
        },
        updateDispatch: (data) => {
            dispatch(updateMaterialRequest(data))
        },
        deleteDispatch: (id) => {
            dispatch(deleteMaterialRequest(id))
        },
        addDispatch: (data) => {
            dispatch(addMaterialRequest(data))
        },
        searchDispatch: (data) => {
            dispatch(searchMaterialRequest(data))
        },
        chooseDispatch: (id) => {
            dispatch(getFractionRequest(id));
            dispatch(chooseMaterial(id))
        },
        unmountSupplierDispatch: () => {
            dispatch(unmountSupplier());
            dispatch(chooseMaterial(0));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MaterialComponent);

// const myArr = [
//     { id: 1, name: 'Vật liệu 1' },
//     { id: 2, name: 'Vật liệu 2' },
//     { id: 3, name: 'Vật liệu 3' },
//     { id: 4, name: 'Vật liệu 4' },
//     { id: 5, name: 'Vật liệu 5' },
//     { id: 6, name: 'Vật liệu 6' },
//     { id: 7, name: 'Vật liệu 7' },
//     { id: 8, name: 'Vật liệu 8' },
//     { id: 9, name: 'Vật liệu 9' },
//     { id: 10, name: 'Vật liệu 10' }
// ]