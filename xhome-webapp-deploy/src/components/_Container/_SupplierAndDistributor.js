import { useEffect, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiClipboardEditOutline } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import PaginationComponent from '../_Common/PaginationComponent'
import HeaderTable from '../MaterialSection/HeaderTable'
import FooterTable from '../MaterialSection/FooterTable'
import '../../styles/scss/container/distributor-component.scss'

const DistributorComponent = () => {
    const Body = () => {
        let mockupArr = myArr.map((item, idx) => {
            return <Item key={idx} item={item} />
        })
        return (
            <TableBody>
                {mockupArr}
            </TableBody>
        )
    }

    return (
        <div className="my-table distributor-component">
            <Container>
                <Table>
                    <HeaderTable />
                    <Body />
                    <FooterTable />
                </Table>
            </Container>
        </div>
    )
}

const Item = (props) => {
    const [name, setName] = useState('')
    const [supplier, setSupplier] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
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
        setNumber(props.item.number)
        setEmail(props.item.email)
        setSupplier(props.item.supplier)
    }, [props.item])
    let properties = {
        name, setName, number, setNumber, email, setEmail,
        supplier, setSupplier, isEditing, setIsEditing, select
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
        name, setName,
        number, setNumber,
        email, setEmail,
        supplier, setSupplier,
        isEditing, setIsEditing,
        select
    } = props.properties
    return (
        <TableRow className={'my-row row-content'}>
            <CellContent className="cell-supplier" property={supplier} select={select} />
            <CellContent className="cell-name" property={name} select={select} />
            <CellContent className="cell-number" property={number} select={select} />
            <CellContent className="cell-email" property={email} select={select} />
            <TableCell className="cell cell-action" width={"10%"}>
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
    const {
        name, setName,
        supplier, setSupplier,
        number, setNumber,
        email, setEmail,
        isEditing, setIsEditing,
        select } = props.properties
    return (
        <TableRow className={'my-row row-input'}>
            <CellInput className="cell-supplier" property={supplier} method={setSupplier} />
            <CellInput className="cell-name" property={name} method={setName} />
            <CellInput className="cell-number" property={number} method={setNumber} />
            <CellInput className="cell-email" property={email} method={setEmail} />
            <TableCell className="cell cell-action" width={"10%"}>
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
const CellContent = (props) => {
    const { property, select } = props
    return (
        <TableCell className={`cell ${props.className}`} width={"30%"}>
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
    const { property, method } = props
    return (
        <TableCell className={"cell"} width={"30%"}>
            <div className="cell-inner">
                <Input
                    className="isEditing"
                    value={property}
                    onChange={(e) => method(e.target.value)}
                    autoFocus />
            </div>
        </TableCell>
    )
}

export default DistributorComponent;

const myArr = [
    { id: 1, supplier: 'Nhà cung cấp 1', name: 'Nhà phân phối 1', number: '0388288611', email: 'staff@elevedo.com' },
    { id: 2, supplier: 'Nhà cung cấp 2', name: 'Nhà phân phối 2', number: '0388288612', email: 'staff@elevedo.com' },
    { id: 3, supplier: 'Nhà cung cấp 3', name: 'Nhà phân phối 3', number: '0388288613', email: 'staff@elevedo.com' },
    { id: 4, supplier: 'Nhà cung cấp 4', name: 'Nhà phân phối 4', number: '0388288614', email: 'staff@elevedo.com' },
    { id: 5, supplier: 'Nhà cung cấp 5', name: 'Nhà phân phối 5', number: '0388288615', email: 'staff@elevedo.com' },
]