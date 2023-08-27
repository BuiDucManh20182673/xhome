import React from 'react';
import { Popover } from '@material-ui/core';
import "../../styles/scss/common/submodal-product.scss"
import '../../styles/scss/container/material-component.scss'
import MaterialComponent from "../_Container/MaterialComponent"
import SegmentComponent from "../_Container/SegmentComponent"
import SupplierComponent from "../_Container/SupplierComponent"
import DistributorComponent from '../_Container/DistributorComponent'
import CatalogComponent from "../_Container/CatalogComponent"
import TypeComponent from "../_Container/TypeComponent"
/* */
const PopupChooseMaterial = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <MaterialComponent />
        </Popover>
    )
}

const PopupChooseSegment = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <SegmentComponent />
        </Popover>
    )
}

const PopupChooseSupplier = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <SupplierComponent />
        </Popover>
    )
}

const PopupChooseDistributor = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <DistributorComponent />
        </Popover>
    )
}

const PopupChooseCatalog = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <CatalogComponent
                detailProduct={false}
            />
        </Popover>
    )
}

const PopupChooseType = (props) => {
    const { anchorEl } = props
    return (
        <Popover
            className="popover-choose-material"
            // elevation={5}
            open={Boolean(anchorEl.checkLocation)}
            onClose={() => props.handleClosePopup()}
            anchorEl={anchorEl.checkLocation}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <TypeComponent />
        </Popover>
    )
}

export { PopupChooseMaterial, PopupChooseSegment, PopupChooseSupplier, PopupChooseDistributor, PopupChooseCatalog, PopupChooseType }