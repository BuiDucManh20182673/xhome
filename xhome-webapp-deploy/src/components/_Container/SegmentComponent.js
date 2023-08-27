import { useEffect, useRef, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, OutlinedInput
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiPlus, mdiClipboardEditOutline } from '@mdi/js';
// import SearchComponent from '../_Common/SearchComponent';
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/type-and-segment-component.scss'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"


const SegmentComponent = (props) => {
    const Head = () => {
        return (
            <TableHead >
                <TableRow>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        {/* <SearchComponent /> */}
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
    const Body = () => {
        let mockupArr = props.listFraction.map((item, idx) => {
            return <Item
                key={idx}
                item={item}
                editFraction={props.editFraction}
                deleteFraction={props.deleteFraction}
            />
        })
        return (
            <TableBody>
                {mockupArr}
            </TableBody>
        )
    }
    const Footer = () => {
        let [fraction, setFraction] = useState('')
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent
                            activePage={props.activePage}
                            totalPage={props.totalPage}
                            onPaginate={(activePage) => {
                                props.getFraction({ activePage: activePage })
                            }}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        <OutlinedInput
                            className="add-input"
                            placeholder="Thêm mới"
                            onChange={(e) => setFraction(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && props.addFraction(fraction)}
                            endAdornment={
                                <Button className="add-btn" onClick={() => {
                                    props.addFraction(fraction)
                                    setFraction('')
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
        <div className="my-table type-and-segment-component">
            <Container>
                <div style={{
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '3px',
                    padding: '10px',
                }}>
                    <Table>
                        <Head />
                        {props.isLoading
                            ?
                            <TableCell colSpan={100}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <img width="50%" src={loadImg} />
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
    const [name, setName] = useState('')
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
    }, [props.item])
    let properties = { name, setName, isEditing, setIsEditing, select }
    return (
        <>
            {
                !isEditing
                    ? <RowContent properties={properties}
                        deleteFraction={props.deleteFraction}
                        fraction={props.item} />
                    : <RowInput properties={properties}
                        editFraction={props.editFraction}
                        fraction={props.item}
                        deleteFraction={props.deleteFraction}
                    />
            }
        </>
    )
}

const RowContent = (props) => {
    const {
        name, isEditing,
        setName, setIsEditing,
        select
    } = props.properties
    return (
        <TableRow className={'my-row row-content'}>
            <TableCell className="cell cell-name" width={"70%"}>
                <div className="cell-inner">
                    <Button className="btn-toggle"
                        onClick={(e) => {
                            select(e.target)
                        }}
                    > {name} </Button>
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
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Danh sách nhà cung cấp tương ứng với phân khúc "${name}" sẽ bị xóa cùng!`)) {
                            props.deleteFraction(props.fraction.id)
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
    useOnClickOutside(clickOutSide, () => setIsEditing(false));
    const { name, isEditing, setName, setIsEditing, select } = props.properties
    return (
        <TableRow ref={clickOutSide} className={'my-row row-input'}>
            <TableCell className="cell cell-name" width={"70%"}>
                <div className="cell-inner">
                    <Input
                        className="isEditing"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => {
                            if (name !== props.fraction.name) {
                                e.key === "Enter" &&
                                    props.editFraction({
                                        id: props.fraction.id,
                                        name: name
                                    })
                            }
                        }}
                        autoFocus />
                </div>
            </TableCell>
            <TableCell className="cell cell-action" width={"30%"}>
                <div className="btn-wrap">
                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => {
                            if (name !== props.fraction.name) {
                                props.editFraction({
                                    id: props.fraction.id,
                                    name: name
                                })
                            }
                            setIsEditing(false)
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Danh sách nhà cung cấp tương ứng với phân khúc "${name}" sẽ bị xóa cùng!`)) {
                            props.deleteFraction(props.fraction.id)
                        }
                    }}>
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
export default SegmentComponent;

// const myArr = [
//     { id: 1, name: 'Phân khúc 1' },
//     { id: 2, name: 'Phân khúc 2' },
//     { id: 3, name: 'Phân khúc 3' },
//     { id: 4, name: 'Phân khúc 4' },
//     { id: 5, name: 'Phân khúc 5' },
//     { id: 6, name: 'Phân khúc 6' }
// ]