import { useEffect, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiClipboardEditOutline } from '@mdi/js';
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/distributor-component.scss'

const FooterTable = () => {
    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={100}>
                    <PaginationComponent />
                </TableCell>
            </TableRow>
            <TableRow className="input-add-wrap">
                <CellFooter property={"Nhà cung cấp"} />
                <CellFooter property={"Nhà phân phối"} />
                <CellFooter property={"Số điện thoại"} />
                <CellFooter property={"Email"} />
                <TableCell className="cell-btn-add" width={"10%"}>
                    <Button variant="contained" className="btn-add--form">
                        Thêm mới
                    </Button>
                </TableCell>
            </TableRow>
        </TableFooter>
    )
}

const CellFooter = (props) => {
    return (
        <TableCell className="cell-input-add" width={"30%"}>
            <Input className="input-add" placeholder={props.property} />
        </TableCell>
    )
}

export default FooterTable