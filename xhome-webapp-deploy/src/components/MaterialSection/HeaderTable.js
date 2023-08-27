import { useEffect, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input
} from '@material-ui/core';
import Icon from '@mdi/react'
import SearchComponent from '../_Common/SearchComponent'
import '../../styles/scss/container/distributor-component.scss'
const HeaderTable = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell colSpan={100}>
                    <SearchComponent />
                </TableCell>
            </TableRow>
            <TableRow className="cell-title">
                <TableCell width={'20%'}>
                    <div className='cell-head'> Nhà cung cấp </div>
                </TableCell>
                <TableCell width={'20%'}>
                    <div className='cell-head'> Nhà phân phối </div>
                </TableCell>
                <TableCell width={'20%'}>
                    <div className='cell-head'> Số điện thoại </div>
                </TableCell>
                <TableCell width={'20%'}>
                    <div className='cell-head'> Email </div>
                </TableCell>
                <TableCell width={'20%'}>
                    <div className='cell-head'></div>
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

export default HeaderTable;