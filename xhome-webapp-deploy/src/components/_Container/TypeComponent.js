import { useEffect, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, OutlinedInput,
    Typography
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiPlus, mdiClipboardEditOutline } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/type-and-segment-component.scss'

const TypeComponent = () => {
    const Head = () => {
        return (
            <TableHead >
                <TableRow>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        <SearchComponent />
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
    const Body = () => {
        let mockupArr = myArr.map((item, idx) => {
            return <Item
                key={idx}
                item={item}
            />
        })
        return (
            <TableBody>
                {mockupArr}
            </TableBody>
        )
    }
    const Footer = () => {
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={100}>
                        <OutlinedInput
                            className="add-input"
                            placeholder="Thêm loại"
                            endAdornment={
                                <Button className="add-btn">
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
                <Table>
                    <Head />
                    <Body />
                    <Footer />
                </Table>
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
                    ? <RowContent properties={properties} />
                    : <RowInput properties={properties} />
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
                    <Button className="btn btn-delete">
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}

const RowInput = (props) => {
    const { name, isEditing, setName, setIsEditing, select } = props.properties
    return (
        <TableRow className={'my-row row-input'}>
            <TableCell className="cell cell-name" width={"70%"}>
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
export default TypeComponent;

const myArr = [
    { id: 1, name: 'Loại 1' },
    { id: 2, name: 'Loại 2' },
    { id: 3, name: 'Loại 3' },
    { id: 4, name: 'Loại 4' },
    { id: 5, name: 'Loại 5' },
    { id: 6, name: 'Loại 6' }
]