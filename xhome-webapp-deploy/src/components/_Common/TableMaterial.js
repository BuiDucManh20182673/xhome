import React, { useState, useEffect } from 'react';
import {
    Button, Typography, Paper, CardMedia,
    Table, TableBody, TableRow, TableCell, TableContainer, TableHead, Checkbox,
} from '@material-ui/core';
import { Icon } from '@mdi/react'
import { mdiSquareEditOutline, mdiDelete, mdiTrumpet } from '@mdi/js'
import "../../styles/scss/common/table-product.scss"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import emptyImg from "../../styles/images/no-images.png"
import { mdiCloseThick } from '@mdi/js'
import img from "../../styles/images/img-product-1.jpg"
// import "../../styles/scss/common/item-product.scss"
// import * as callAPI from '../../constants/callAPI'
import * as actions from '../../constants/actionCreators'
// import { } from "../../constants/"
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        listIdChoosedMaterial: state.projectReducer.listIdChoosedMaterial,
        activeArea: state.projectReducer.activeArea,
        listSelectedProduct: state.projectReducer.selectedData,
        listSelection: state.productReducer.listSelection,
        isLoading: state.productReducer.isFetching
    }
}
const mapDisptachToProps = (dispatch) => {

    return ({
        deleteItemSelected: (data) => {
            dispatch(actions.deleteItemSelected(data))
        },
        chooseMaterial: (data) => {
            dispatch(actions.chooseProductlAction(data))
        }
    })
}

const TableMaterial = connect(mapStateToProps, mapDisptachToProps)(
    (props) => {
        const { chooseMaterials, selectedMaterial, materialsByArea } = props;
        const widthScreen = window.innerWidth;
        let listItemProduct = []
        const [isLoadingImage, setIsLoadingImage] = useState(false);
        const [isLoadingImageCatalog, setIsLoadingImageCatalog] = useState(false);
        useEffect(() => setIsLoadingImage(true), [props.listSelection])
        useEffect(() => setIsLoadingImageCatalog(true), [props.listSelection])
        if (props.typeTable === 'choose-material') {
            let listMap = [];
            if (props.listSelection.count >= 0) {
                listMap = props.listSelection
            }
            if (listMap.rows) {
                listItemProduct = listMap.rows.map((item, key) => {
                    // let index = item.distributor[0].indexOf(item.distributor[0].match("\n"))
                    const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
                    // let distributor = isAdmin === 1 ? item.distributor[0] : item.distributor[0].slice(0, index)
                    return (
                        <>
                            {
                                window.innerWidth >= 768
                                    ?
                                    <TableRow className="table-list-product-row " key={key}>
                                        {chooseMaterials &&
                                            <TableCell align="center">
                                                <Checkbox color="primary"
                                                    checked={
                                                        props.listIdChoosedMaterial[props.activeArea].indexOf(item.id) !== -1
                                                            ?
                                                            true
                                                            :
                                                            false
                                                    }
                                                    onClick={() => {
                                                        {
                                                            props.listIdChoosedMaterial[props.activeArea].indexOf(item.id) !== -1
                                                                ?
                                                                props.deleteItemSelected({
                                                                    areaIndex: props.activeArea,
                                                                    productIndex: item.id,
                                                                    activePage: 1,
                                                                })
                                                                :
                                                                props.chooseMaterial({
                                                                    areaIndex: props.activeArea,
                                                                    material: item
                                                                })
                                                        }
                                                    }} />
                                            </TableCell>
                                        }
                                        <TableCell className="table-serial" align="center">{key + 1}</TableCell>
                                        <TableCell className="table-image" align="center">
                                            <div style={{
                                                backgroundImage: `url("${isLoadingImage ? loadImg : item.image_url === "" ? emptyImg : item.image_url}")`
                                            }}></div>
                                            <img
                                                src={item.image_url}
                                                className="loadingImage"
                                                onLoad={() => setIsLoadingImage(false)}
                                                onError={() => setIsLoadingImage(false)}
                                            />
                                            <span>{item.code}</span>
                                        </TableCell>
                                        <TableCell className="table-item" align="center">{item.product}</TableCell>
                                        <TableCell className="table-item" align="center">{item.group}</TableCell>
                                        <TableCell className="table-item" align="center">{item.fraction}</TableCell>
                                        <TableCell className="table-brand" align="center">
                                            <Typography>{item.supplier}</Typography>
                                        </TableCell>
                                        {/* <TableCell className="table-brand" align="center">
                                            <Typography className="distributor">{distributor}</Typography>
                                        </TableCell> */}
                                        <TableCell className="table-image" align="center">
                                            <div style={{
                                                backgroundImage: `url("${isLoadingImageCatalog ? loadImg : item.catalog_image === "" ? emptyImg : item.catalog_image}")`
                                            }}></div>
                                            <img
                                                src={item.catalog_image}
                                                className="loadingImage"
                                                onLoad={() => setIsLoadingImageCatalog(false)}
                                                onError={() => setIsLoadingImageCatalog(false)}
                                            />
                                            <span>{item.catalog_name}</span>
                                        </TableCell>
                                        {/* <TableCell className={selectedMaterial && 'hidden-table-cell'} align="center">
                                <Button className="btn-quick-fixes" variant="contained" >
                            {/*<TableCell className={selectedMaterial && 'hidden-table-cell'} align="center">
                                <Button className="btn-quick-fixes" variant="contained" >
                                     Sửa
                                    <Icon path={mdiSquareEditOutline} size={1} />
                                </Button>
                            </TableCell>*/}
                                        <TableCell className={chooseMaterials && 'hidden-table-cell'} align="center">
                                            <Button className="btn-remove" variant="contained">
                                                Bỏ
                                    <Icon path={mdiDelete} size={1} />
                                            </Button>
                                        </TableCell>
                                    </TableRow >
                                    :
                                    <div className="block-materials-mobile">
                                        <div className="img-materials">
                                            <img
                                                src={isLoadingImage ? loadImg : item.image_url === "" ? emptyImg : item.image_url}
                                                onLoad={() => setIsLoadingImage(false)}
                                                onError={() => setIsLoadingImage(false)}
                                            />
                                        </div>
                                        <div className="detail-info">
                                            <div className="detail-info-left">
                                                <p style={{fontWeight: 'bold'}}>{item.product}</p>
                                                <p>{item.fraction}</p>
                                                <p>{item.group}</p>
                                                <p>{item.code}</p>
                                            </div>
                                            <div className="detail-info-right">
                                                <p>&nbsp;</p>
                                                <br />
                                                <p>{item.supplier}</p>
                                                <p>{item.catalog_name}</p>
                                            </div>
                                        </div>
                                        <div className="action-wrap">
                                            <div className="icon">
                                                {props.chooseMaterials &&
                                                    <Checkbox className="checkbox-choose-materials" color="primary"
                                                        checked={
                                                            props.listIdChoosedMaterial[props.activeArea].indexOf(item.id) !== -1
                                                                ?
                                                                true
                                                                :
                                                                false
                                                        }
                                                        onClick={() => {
                                                            {
                                                                props.listIdChoosedMaterial[props.activeArea].indexOf(item.id) !== -1
                                                                    ?
                                                                    props.deleteItemSelected({
                                                                        areaIndex: props.activeArea,
                                                                        productIndex: item.id,
                                                                        activePage: 1,
                                                                    })
                                                                    :
                                                                    props.chooseMaterial({
                                                                        areaIndex: props.activeArea,
                                                                        material: item
                                                                    })
                                                            }
                                                        }}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </div>
                            }
                        </>
                    )
                })
            }

        }
        if (props.typeTable === 'selectedData') {
            listItemProduct = props.listSelectedProduct.map((item, key) => {
                // let index = item.distributor[0].indexOf(item.distributor[0].match("\n"))
                const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
                // let distributor = isAdmin === 1 ? item.distributor[0] : item.distributor[0].slice(0, index)
                return (
                    <>
                        {
                            window.innerWidth >= 768
                                ?
                                <TableRow className="table-list-product-row " key={key}>
                                    {chooseMaterials &&
                                        <TableCell align="center">
                                            <Checkbox color="primary" />
                                        </TableCell>
                                    }
                                    <TableCell className="table-serial" align="center">{key + 1}</TableCell>
                                    <TableCell className="table-image" align="center">
                                        <div style={{ backgroundImage: `url("${item.image_url}")` }}></div>
                                    </TableCell>
                                    <TableCell className="table-item" align="center">{item.product}</TableCell>
                                    <TableCell className="table-item" align="center">{item.group}</TableCell>
                                    <TableCell className="table-item" align="center">{item.fraction}</TableCell>
                                    <TableCell className="table-brand" align="center">
                                        <Typography>{item.supplier}</Typography>
                                    </TableCell>
                                    {/* <TableCell className="table-brand" align="center">
                            <Typography className="distributor">{
                                distributor
                            }</Typography>
                        </TableCell> */}
                                    <TableCell className="table-image" align="center">
                                        <div style={{ backgroundImage: `url("${item.catalog_image}")` }}></div>
                                    </TableCell>
                                    {/* <TableCell className={selectedMaterial && 'hidden-table-cell'} align="center">
                            <Button className="btn-quick-fixes" variant="contained" >
                                Sửa
                                <Icon path={mdiSquareEditOutline} size={1} />
                            </Button>
                        </TableCell> */}
                                    <TableCell className={chooseMaterials && 'hidden-table-cell'} align="center">
                                        <Button style={{ minWidth: "40px" }} className="btn-remove" variant="contained"
                                            onClick={() => {
                                                props.deleteItemSelected({
                                                    areaIndex: props.activeArea,
                                                    productIndex: item.id,
                                                    activePage: 1
                                                })
                                            }}
                                        >
                                            {/* Bỏ */}
                                            <Icon path={mdiDelete} size={1} />

                                        </Button>
                                    </TableCell>
                                </TableRow>
                                :
                                <div className="block-materials-mobile">
                                    <div className="img-materials">
                                        <img
                                            src={isLoadingImage ? loadImg : item.image_url === "" ? emptyImg : item.image_url}
                                            onLoad={() => setIsLoadingImage(false)}
                                            onError={() => setIsLoadingImage(false)}
                                        />
                                    </div>
                                    <div className="detail-info">
                                        <div className="detail-info-left">
                                            <p style={{fontWeight: 'bold'}}>{item.product}</p>
                                            <p>{item.fraction}</p>
                                            <p>{item.group}</p>
                                            <p>{item.code}</p>
                                        </div>
                                        <div className="detail-info-right">
                                            <p>&nbsp;</p>
                                            <br />
                                            <p>{item.supplier}</p>
                                            <p>{item.catalog_name}</p>
                                        </div>
                                    </div>
                                    <div className="action-wrap">
                                        <Button
                                            className="icon"
                                            color="secondary"
                                            onClick={() => {
                                                props.deleteItemSelected({
                                                    areaIndex: props.activeArea,
                                                    productIndex: item.id,
                                                    activePage: 1
                                                })
                                            }}
                                        >
                                            <Icon className="icon-remove" path={mdiDelete} size={0.8} />
                                        </Button>
                                    </div>
                                </div>
                        }
                    </>
                )
            })
        }
        return (
            <div className="table-list-product" style={{ display: "flex", justifyContent: "center" }}>
                {props.isLoading ?
                    <img src={loadImg} />
                    :
                    <TableContainer component={Paper} className="table-container-dialog">
                        <Table size="small">
                            {!materialsByArea &&
                                <TableHead className="table-head">
                                    <TableRow className="table-head-row">
                                        {chooseMaterials &&
                                            <TableCell width="3%" align="center">
                                                {/* <Checkbox color="primary" /> */}
                                            </TableCell>
                                        }
                                        {widthScreen >= 768 &&
                                            <>
                                                <TableCell width={chooseMaterials && "5%"} style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>STT</TableCell>
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>Mã + ảnh</TableCell>
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>Sản phẩm</TableCell>
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>Loại</TableCell>
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>Phân khúc</TableCell>
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>NCC</TableCell>
                                                {/* <TableCell>NPP</TableCell> */}
                                                <TableCell style={{fontSize: 16, padding: '0.5rem 0', color: '#333'}}>Quyển</TableCell>
                                                {(props.typeTable === 'selectedData')
                                                    ?
                                                    <TableCell colSpan={(chooseMaterials || selectedMaterial) ? '1' : '2'}>Hành động</TableCell>
                                                    :
                                                    ""}
                                            </>
                                        }
                                        {/* {selectedMaterial && <TableCell>Hành động</TableCell>} */}
                                    </TableRow>
                                </TableHead>
                            }
                            <TableBody>
                                {listItemProduct}

                            </TableBody>
                        </Table>
                    </TableContainer>
                }

            </div>
        )
    }

)

export { TableMaterial }