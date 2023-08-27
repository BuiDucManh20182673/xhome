import React, { useState, useEffect } from 'react';
import {
    Button, Fab, Badge,
    TextField, Popover,
    Dialog, DialogTitle, DialogContent, DialogActions, debounce,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Icon } from '@mdi/react'
import { mdiCloseThick, mdiTuneVariant, mdiMagnify } from '@mdi/js'
// import img from "../../styles/images/img-product-1.jpg"
import { DialogSelectMaterials } from './ProductSelectedComponent'
import { DialogAddNewProduct } from '../_Common/ModalProduct'
import { ItemProduct } from '../_Common/ItemProduct'
import { TableMaterial } from '../_Common/TableMaterial'
import Pagination from "../_Common/PaginationComponent"
import "../../styles/scss/container/product-component.scss"
import * as actions from '../../constants/actionCreators'
import { connect } from 'react-redux';


const mapStateToPropsProductFilter = (state) => {
    return {
        listMaterialFilter: state.productReducer.listMaterialFilter,
        listCatalogFilter: state.productReducer.listCatalogFilter,
        listAgencyFilter: state.productReducer.listAgencyFilter,
        listFactionFilter: state.productReducer.listFactionFilter,
        materialName: state.productReducer.materialName,
        catalogName: state.productReducer.catalogName,
        agencyName: state.productReducer.agencyName,
        fractionName: state.productReducer.fractionName,
        keyWord: state.productReducer.keyWord,
        activePage: state.productReducer.activePage,
    }
}

const mapDisptachToPropsProductFilter = (dispatch) => {

    return ({
        getMaterialFilter: (data) => {
            dispatch(actions.getMaterialFilter(data))
        },
        getFractionFilter: (data) => {
            dispatch(actions.getFractionFilter(data))
        },
        getAgencyFilter: (data) => {
            dispatch(actions.getAgencyFilter(data))
        },
        getCatalogFilter: (data) => {
            dispatch(actions.getCatalogFilter(data))
        },
        getListSelection: (data) => {
            dispatch(actions.getListSelection(data))
        },
        getMaterialFilterForcus: (data) => {
            dispatch(actions.getMaterialForcus(data))
        },
        getFractionFilterForcus: (data) => {
            dispatch(actions.getFractionForcus(data))
        },
        getCatalogFilterForcus: (data) => {
            dispatch(actions.getCatalogForcus(data))
        },
        getAgencyFilterForcus: (data) => {
            dispatch(actions.getAgencyForcus(data))
        }, getDataProduct: (data) => {
            dispatch(actions.getProduct(data))
        },
        clearName: () => {
            dispatch(actions.clearName())
        }
    })
}

const PopupFilter = connect(mapStateToPropsProductFilter, mapDisptachToPropsProductFilter)(
    (props) => {
        useEffect(() => { props.getDataProduct({ activePage: 1 }) }, [])

        var listMaterialFilter = []
        const [Material, setMaterial] = useState('')
        const [Catalog, setCatalog] = useState('')
        const [Agency, setAgency] = useState('')
        const [Faction, setFaction] = useState('')
        if (props.listMaterialFilter.length > 0) {
            props.listMaterialFilter.map((item, idx) => {
                return listMaterialFilter.push({ title: item.name })
            })
        }
        var listCatalogFilter = []
        if (props.listCatalogFilter.length > 0) {
            props.listCatalogFilter.map((item, idx) => {
                return listCatalogFilter.push({ title: item.name })
            })
        }
        var listAgencyFilter = []
        if (props.listAgencyFilter.length > 0) {
            props.listAgencyFilter.map((item, idx) => {
                return listAgencyFilter.push({ title: item.name })
            })
        }
        var listFactionFilter = []
        if (props.listFactionFilter.length > 0) {

            props.listFactionFilter.map((item, idx) => {
                return listFactionFilter.push({ title: item.name })
            })
        }
        return (
            <Popover
                className="popover-filter-container"
                elevation={1}
                open={Boolean(props.locationFilter)}
                onClose={() => props.closeFilter(false)}
                anchorEl={props.locationFilter}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >

                <div className="popover-header">
                    <span>Lọc</span>
                    <Icon style={{ cursor: "pointer" }} size={0.7} path={mdiCloseThick} onClick={() => { props.closeFilter(false) }} />
                </div>
                <div className="popover-content">
                    <Autocomplete
                        className="input-filter"
                        size="small"
                        options={listMaterialFilter}
                        getOptionLabel={(option) => option.title}
                        style={{ width: 250 }}
                        value={{ title: props.valueMaterial !== null ? props.valueMaterial : '' }}
                        renderInput={
                            (params) => <TextField {...params} placeholder="Chọn Vật Liệu" variant="outlined"
                                onChange={(e, value) => {
                                    {
                                        props.valueMaterialfr(e.target.value)
                                        if (e.target.value === '') {
                                            props.getMaterialFilterForcus()
                                        } else {
                                            props.getMaterialFilter(e.target.value)
                                        }
                                    }
                                }}
                            />
                        }
                        onChange={(e, value) => {
                            props.valueMaterialfr(e.target.value)
                            // setNext(true)
                            if (!e.target.value) {
                                props.getMaterialFilterForcus()
                            }
                            if (value) {
                                props.valueMaterialfr(value.title)
                            }
                        }}
                        onFocus={(e, value) => {
                            props.getMaterialFilterForcus();
                        }}
                    />
                    <Autocomplete
                        className="input-filter"
                        size="small"
                        options={listFactionFilter}
                        getOptionLabel={(option) => option.title}
                        style={{ width: 250 }}
                        value={{ title: props.valueFraction !== null ? props.valueFraction : '' }}
                        renderInput={(params) => <TextField {...params} placeholder="Chọn Phân Khúc" variant="outlined"
                            onChange={(e) => {
                                props.valueFractionfr(e.target.value)

                                if (e.target.value === '') {
                                    props.getFractionFilterForcus()
                                } else {
                                    props.getFractionFilter(e.target.value)
                                }
                            }}
                        />}
                        onChange={(e, value) => {
                            props.valueFractionfr(e.target.value)
                            if (!e.target.value) {
                                props.getFractionFilterForcus()
                            }
                            if (value) {
                                props.valueFractionfr(value.title)
                            }
                        }}
                        onFocus={(e, value) => {
                            props.getFractionFilterForcus();
                        }}
                    />
                    <Autocomplete
                        className="input-filter"
                        size="small"
                        options={listAgencyFilter}
                        getOptionLabel={(option) => option.title}
                        style={{ width: 250 }}
                        value={{ title: props.valueAgency !== null ? props.valueAgency : '' }}
                        renderInput={(params) => <TextField {...params} placeholder="Chọn Nhà Cung Cấp" variant="outlined"
                            onChange={(e) => {
                                props.valueAgencyfr(e.target.value)

                                if (e.target.value === '') {
                                    props.getAgencyFilterForcus()

                                } else {
                                    props.getAgencyFilter(e.target.value)
                                }
                            }}
                        />}
                        onChange={(e, value) => {
                            props.valueAgencyfr(e.target.value)
                            if (!e.target.value) {
                                props.getAgencyFilterForcus()
                            }
                            if (value) {
                                props.valueAgencyfr(value.title)

                            }
                        }}
                        onFocus={(e, value) => {
                            props.getAgencyFilterForcus();
                        }}
                    />
                    <Autocomplete
                        className="input-filter"
                        size="small"
                        options={listCatalogFilter}
                        getOptionLabel={(option) => option.title}
                        style={{ width: 250 }}
                        value={{ title: props.valueCatalog !== null ? props.valueCatalog : '' }}
                        renderInput={(params) => <TextField {...params} placeholder="Chọn Quyển" variant="outlined"
                            onChange={(e) => {
                                props.valueCatalogfr(e.target.value)
                                if (e.target.value === '') {
                                    props.getCatalogFilterForcus()
                                } else {
                                    props.getCatalogFilter(e.target.value)
                                }
                            }}
                        />}
                        onChange={(e, value) => {
                            props.valueCatalogfr(e.target.value)
                            if (!e.target.value) {
                                props.getCatalogFilterForcus()
                            }
                            if (value) {
                                props.valueCatalogfr(value.title)

                            }
                        }}
                        onFocus={(e, value) => {
                            props.getCatalogFilterForcus();
                        }}
                    />
                </div>

                <div className="popover-footer">
                    <Button variant="contained" size="small" color="primary"
                        onClick={() => {
                            props.getListSelection({
                                keyWord: props.keyWord, activePage: 1
                                , materialName: props.valueMaterial, fractionName: props.valueFraction, agencyName: props.valueAgency, catalogName: props.valueCatalog
                            })
                            props.closeFilter(false)
                        }}
                    >Áp dụng</Button>
                    <Button variant="contained" size="small" color="secondary"
                        onClick={() => {
                            props.clearName()
                            props.valueMaterialfr(null)
                            props.valueFractionfr(null)
                            props.valueAgencyfr(null)
                            props.valueCatalogfr(null)
                            props.getListSelection({
                                keyWord: null, activePage: 1
                                , materialName: null, fractionName: null, agencyName: null, catalogName: null
                            })
                            props.closeFilter(false)
                        }
                        }
                    >Bỏ lọc</Button>
                </div>
            </Popover>
        )
    }
)

const mapStateToPropsProduct = (state) => {
    return {
        listSelection: state.productReducer.listSelection,
        totalPage: state.productReducer.totalPage,
        activePage: state.productReducer.activePage,
        materialName: state.productReducer.materialName,
        catalogName: state.productReducer.catalogName,
        agencyName: state.productReducer.agencyName,
        fractionName: state.productReducer.fractionName,
        keyWord: state.productReducer.keyWord,
        activeArea: state.projectReducer.activeArea,
    }
}

const mapDisptachToPropsProduct = (dispatch) => {

    return ({
        getDataProduct: (data) => {
            dispatch(actions.getProduct(data))
        },
        getListSelection: (data) => {
            dispatch(actions.getListSelection(data))
        }
    })
}
const DialogListMaterials = connect(mapStateToPropsProduct, mapDisptachToPropsProduct)((props) => {
    const [openDialogAddNew, setOpenDialogAddNew] = useState(false)
    const [openSelectMaterials, setOpenSelectMaterials] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [valueMaterial, setValueMaterial] = useState('')
    const [valueAgency, setValueAgency] = useState('')
    const [valueFraction, setValueFraction] = useState('')
    const [valueCatalog, setValueCatalog] = useState('')
    const [keyWord, setKeyWord] = useState('')
    React.useEffect(() => {
        setKeyWord(props.keyWord)
    }, [props.keyWord])
    return (
        <Dialog
            fullScreen={window.innerWidth < 600 ? true : false}
            className="dialog-container dialog-container-list-materials"
            fullWidth={true}
            maxWidth="lg"
            open={props.open}
        >
            <DialogTitle className="dialog-title">
                <label className="form-filter-search">
                    <Button variant="contained"
                        onClick={(e) => setOpenFilter(e.currentTarget)}
                        key={props.key}
                        style={{ width: "110px" }}
                    >
                        <Icon path={mdiTuneVariant} size={1} />
                        &nbsp; Lọc

                    </Button>
                    <PopupFilter
                        {...props}
                        locationFilter={openFilter}
                        handleCloseFilter={() => setOpenFilter(null)}
                        closeFilter={(data) => { setOpenFilter(data) }}
                        valueMaterialfr={(data) => {
                            setValueMaterial(data)
                        }}
                        valueMaterial={valueMaterial}

                        valueAgencyfr={(data) => {
                            setValueAgency(data)
                        }}
                        valueAgency={valueAgency}

                        valueCatalogfr={(data) => {
                            setValueCatalog(data)
                        }}
                        valueCatalog={valueCatalog}

                        valueFractionfr={(data) => {
                            setValueFraction(data)
                        }}
                        valueFraction={valueFraction}
                    />
                    <TextField
                        // className="input-add-area"
                        variant="outlined"
                        size="small"
                        placeholder="Tìm kiếm..."
                        // defaultValue={keyWord}
                        autoFocus={window.innerWidth > 768}
                        onChange={
                            debounce(
                                (e) => {
                                    props.getListSelection({
                                        keyWord: e.target.value, activePage: 1
                                        , materialName: props.materialName, catalogName: props.catalogName, agencyName: props.agencyName
                                    })
                                }, 500)
                        }
                        InputProps={{
                            endAdornment: <Icon path={mdiMagnify} size={1} />
                        }}
                    />
                </label>
                <div
                    style={window.innerWidth < 600 ? { display: "none" } : { display: "block" }}
                    className="btn-close"
                    onClick={() => props.handleClose()}
                >
                    <Icon path={mdiCloseThick} size={1} />
                </div>
            </DialogTitle>

            <DialogContent className="dialog-content">
                <TableMaterial
                    {...props}
                    chooseMaterials={true}
                    typeTable="choose-material"
                />
                {window.innerWidth < 768 &&
                    <Pagination typeTable='chooseProduct' {...props} totalPage={props.totalPage} activePage={props.activePage}
                        onPaginate={(pageIndex) => {
                            props.getListSelection({
                                keyWord: props.keyWord, activePage: pageIndex
                                , materialName: props.materialName, catalogName: props.catalogName, agencyName: props.agencyName, fractionName: props.fractionName
                            })

                        }} />}

            </DialogContent>
            <DialogActions className="dialog-actions-list-materials">
                <label>
                    <Button className="btn-quick-creation" variant="contained" onClick={() => 
                        setOpenDialogAddNew(true)}
                        >Tạo nhanh</Button>
                    <Button className="btn-select-materials" variant="contained" onClick={() => setOpenSelectMaterials(true)}>Đã chọn</Button>
                    <DialogSelectMaterials open={openSelectMaterials} handleClose={() => setOpenSelectMaterials(false)} />
                    <DialogAddNewProduct type="add" activeArea = {props.activeArea} open={openDialogAddNew} handleClose={() => setOpenDialogAddNew(false)} />
                </label>
                {window.innerWidth >= 768 &&
                    <Pagination typeTable='chooseProduct' {...props} totalPage={props.totalPage} activePage={props.activePage}
                        onPaginate={(pageIndex) => {
                            props.getListSelection({
                                keyWord: props.keyWord, activePage: pageIndex
                                , materialName: props.materialName, catalogName: props.catalogName, agencyName: props.agencyName, fractionName: props.fractionName
                            })

                        }} />}
                <div className="btn-action-right">
                    <Button className="btn-complete" variant="contained" color="primary"
                        onClick={() => props.handleClose()}
                    >Xong</Button>
                    <Button
                        style={window.innerWidth < 600 ? { display: "none" } : { display: "inline-block" }}
                        className="btn-cacel"
                        variant="contained"
                        color="secondary"
                        onClick={() => props.handleClose()}
                    >Hủy</Button>
                </div>
            </DialogActions>
        </Dialog>
    )
})

const mapStateToProps = (state) => {
    return {
        listIdChoosedMaterial: state.projectReducer.listIdChoosedMaterial,
        activeArea: state.projectReducer.activeArea,
        listSelectedProduct: state.projectReducer.selectedData,
        listSelection: state.productReducer.listSelection,
        isLoading: state.productReducer.isFetching
    }
}

const mapDispatchToProps = (dispatch) => {
    return ({
        deleteItemSelected: (data) => {
            dispatch(actions.deleteItemSelected(data))
        },
        chooseMaterial: (data) => {
            dispatch(actions.chooseProductlAction(data))
        }
    })
}
const ListMaterialsMobile = connect(mapStateToProps, mapDispatchToProps)((props) => {
    return (
        <div className="mobile-list-materials">
            <ItemProduct chooseMaterials={true} {...props} />
            <Fab
                className="btn-selected-materials" variant="extended"
                onClick={() => props.handleScreenSelectedMaterial()}
            >
                <Badge badgeContent={4} color="secondary">
                    Phòng bếp
                </Badge>
            </Fab>
            <label className="block-btn-action">
                <Button
                    variant="contained" color="primary"
                    onClick={() => props.handleScreenAddNewMaterial()}
                >Tạo nhanh</Button>
                <Button variant="contained" className="btn-save">Lưu</Button>
                <Button
                    variant="contained" color="secondary"
                    onClick={() => props.handleScreenProjectCreation()}
                >Hủy</Button>
            </label>
        </div>
    )
})

export { DialogListMaterials, ListMaterialsMobile }