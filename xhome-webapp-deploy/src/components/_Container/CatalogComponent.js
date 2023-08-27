import React, { useEffect, useRef, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiDelete, mdiClipboardEditOutline, mdiViewModule, mdiUpload } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import { DOMAIN_IMAGE } from "../../constants/callAPI"
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import uploadImage from "../../api/uploadImage"
import emptyImg from "../../styles/images/no-images.png"
import PaginationComponent from '../_Common/PaginationComponent'
import '../../styles/scss/container/catalog-component.scss'
import * as actions from "../../constants/actionCreators"
import { connect } from 'react-redux';


const mapStateToProps = (state) => {
    return {
        listCatalog: state.catalog.listCatalog,
        textSearch: state.catalog.textSearch,
        supplierId: state.catalog.supplierId,
        isLoading: state.catalog.isLoading,
        catalog: state.catalog,
        agencyId: state.supplier.chooseId
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        takeListCatalog: (activePage) => {
            dispatch(actions.getListCatalogRequest(activePage))
        },
        editCatalog: (data) => {
            dispatch(actions.editCatalogRequest(data))
        },
        deleteCatalog: (data) => {
            dispatch(actions.deleteCatalogRequest(data))
        },
        unMount: () => {
            dispatch(actions.unmountCatalog())
        },
        addDispatch: (data) => {
            dispatch(actions.addCatalogRequest(data))
        },
        getCatalogByAgencyIdRequest: (data) => {
            dispatch(actions.getCatalogByAgencyIdRequest(data))
        },
        searchCatalog: (data) => {
            dispatch(actions.searchCatalogRequest(data))
        },
    }
}
const CatalogComponent = connect(mapStateToProps, mapDispatchToProps)((props) => {
    useEffect(() => {
        if (window.location.pathname.match("catalog")) {
            props.takeListCatalog(1);
            props.unMount();
        }
    }, [])
    const Head = (w = window.innerWidth) => {
        return (
            <TableHead className="table-head-catalog">
                <TableRow>
                    <TableCell style={{ display: 'flex', justifyContent: 'flex-start', padding: '1em 0' }}>
                        <div className='cell-head' style={{ fontSize: 18 }}> Ảnh quyển </div>
                    </TableCell>
                    <TableCell>
                        <div className='cell-head' style={{ fontSize: 18 }}> Tên quyển </div>
                    </TableCell>
                    <TableCell>
                        <div className='cell-head' style={{ fontSize: 18 }}> Phân Khúc </div>
                    </TableCell>
                    <TableCell>
                        <div className='cell-head' style={{ fontSize: 18 }}> Nhà cung cấp </div>
                    </TableCell>
                    {/* <TableCell>
                        <div className='cell-head'> Nhà phân phối </div>
                    </TableCell> */}
                    <TableCell style={{ display: 'flex', justifyContent: 'flex-end', padding: '1em 0' }}>
                        <div className='cell-head' style={{ fontSize: 18 }}> Hành động </div>
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
    const Body = (props) => {
        let listCatalog = props.listCatalog;
        useEffect(() => listCatalog = props.listCatalog, [props])
        let mockupArr = listCatalog.rows ? listCatalog.rows.map((item, idx) => {
            return <Item
                key={idx}
                item={item}
                editCatalog={props.editCatalog}
                deleteCatalog={props.deleteCatalog}
                activePage={props.activePage}
                handleShowProduct={props.handleShowProduct}
                handleGetIdCatalog={props.handleGetIdCatalog}
            />
        }) : []
        return (
            <TableBody>
                {mockupArr}
            </TableBody>
        )
    }

    const mapStateToPropsFooter = (state) => {
        return {
            listCatalog: state.catalog.listCatalog,
            textSearch: state.catalog.textSearch,
            isLoading: state.catalog.isLoading,
            catalog: state.catalog,
            agencyId: state.supplier.chooseId,
            supplierId: state.catalog.supplierId,
        }
    }

    const mapDispatchToPropsFooter = (dispatch) => {
        return {
            searchCatalog: (data) => {
                dispatch(actions.searchCatalogRequest(data))
            },
            searchCatalogById: (data) => {
                dispatch(actions.searchCatalogIdRequest(data))
            },
            getCatalogByAgencyIdRequest: (data) => {
                dispatch(actions.getCatalogByAgencyIdRequest(data))
            },
        }
    }
    const Footer = connect(mapStateToPropsFooter, mapDispatchToPropsFooter)((props) => {
        const [isPickedImage, setIsPickedImage] = useState(false)
        let w = window.innerWidth
        const [imageUrl, setImageUrl] = useState("");
        const handleSelectFileAdd = async (event) => {
            setIsPickedImage(true)
            const imageFile = event.target.files[0];

            if (!imageFile) {
                alert('Vui lòng chọn ảnh!')
                setIsPickedImage(false)
                return false;
            }

            if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
                alert('Định dạng ảnh không hỗ trợ!')
                setIsPickedImage(false)
                return false;
            }

            const res = await uploadImage(imageFile)
            if (res.err) {
                alert("Đã xảy ra lỗi khi thêm ảnh!")
                setIsPickedImage(false)
            } else {
                setImageUrl(DOMAIN_IMAGE + res.fileName)
            }
            // var reader = new FileReader();
            // reader.readAsDataURL(imageFile);
            // reader.onload = (e) => {
            //     setImageUrl([reader.result])
            // };
        }
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent
                            activePage={props.activePage}
                            totalPage={props.totalPage}
                            onPaginate={(activePage) => {
                                if (props.agencyId !== 0) {
                                    if (props.supplierId !== 0) {
                                        props.searchCatalogById({ supplierId: props.supplierId, textSearch: props.textSearch, pageIndex: activePage })
                                    } else {
                                        props.getCatalogByAgencyIdRequest(activePage);
                                    }
                                } else {
                                    if (props.textSearch === '') {
                                        props.takeListCatalog(activePage);
                                    } else {
                                        if (window.location.pathname.match("catalog")) {
                                            props.searchCatalog({ textSearch: props.textSearch, pageIndex: activePage })
                                        }
                                    }
                                }
                            }}
                        />
                    </TableCell>
                </TableRow>
                {window.location.pathname.match("catalog") &&
                    <TableRow colSpan={100} className="input-add-wrap" style={{ position: 'relative' }}>
                        {/* <CellImage className="cell-image" isSelectImage={true} isPickedImage={isPickedImage} setIsPickedImage={setIsPickedImage} property={imageUrl} /> */}
                        {/* <CellFooter addDispatch={props.addDispatch} handleSelectFileAdd={handleSelectFileAdd} property={"Tên quyển"} imageUrl={imageUrl} /> */}
                    </TableRow>
                }
            </TableFooter>
        )
    })
    return (
        <Container style={{ display: "flex", justifyContent: "center", flexDirection: "column" }} className="my-table distributor-component">
            {props.isLoading ?
                <TableCell colSpan={100}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img width="30%" src={loadImg} />
                    </div>
                </TableCell>
                :
                <>
                    {/* <SearchComponent /> */}
                    <Table>
                        <Head />
                        <Body
                            editCatalog={props.editCatalog}
                            deleteCatalog={props.deleteCatalog}
                            listCatalog={props.listCatalog}
                            activePage={props.catalog.activePage}
                            handleShowProduct={props.handleShowProduct}
                            handleGetIdCatalog={props.handleGetIdCatalog} />
                        <Footer
                            activePage={props.catalog.activePage}
                            totalPage={props.catalog.totalPage}
                            takeListCatalog={props.takeListCatalog}
                            addDispatch={props.addDispatch}
                            agencyId={props.agencyId}
                            getCatalogByAgencyIdRequest={props.getCatalogByAgencyIdRequest}
                        />
                    </Table>
                    {/* <input type="button" value="Export into PDF" onClick={() => window.print()}/> */}
                </>
            }
        </Container>
    )
})
const Item = (props) => {
    const [path, setPath] = useState('')
    const [name, setName] = useState('')
    const [material, setMaterial] = useState('')
    const [type, setType] = useState('')
    const [supplier, setSupplier] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    function select(e) {
        props.handleShowProduct(name)
        props.handleGetIdCatalog(props.item.id)
    }
    useEffect(() => {
        const { imageUrl, name, material, type } = props.item;
        setPath(imageUrl)
        setName(name)
        setMaterial(material)
        setType(type)
    }, [props.item])

    let properties = {
        path, setPath, name, setName, material, setMaterial,
        type, setType, supplier, setSupplier,
        isEditing, setIsEditing, select
    }
    return (
        <>
            {
                !isEditing
                    ? <RowContent properties={properties} {...props} />
                    : <RowInput isSelectImage={true} properties={properties} id={props.item.id} {...props} />
            }
        </>
    )
}

const RowContent = (props) => {
    const {
        path, setPath, name, setName, material, setMaterial,
        type, setType, supplier, setSupplier,
        isEditing, setIsEditing, select
    } = props.properties
    return (
        <TableRow className={'my-row row-content'}>
            <CellImage property={path} select={select} />
            <CellContent property={name} select={select} />
            {/* <CellContent property={material} select={select} /> */}
            <CellContent property={props.item.agency.fraction_id !== null && props.item.agency.fraction.name} select={select} />
            <CellContent property={props.item.agency.supplier} select={select} />
            {/* <CellContent property={props.item.agency.distributor.name} select={select} /> */}
            <TableCell className="cell cell-action">
                <div className="btn-wrap">
                    {/* <Button
                        className={"btn"}
                        onClick={() => {
                            props.handleShowProduct(name)
                            props.handleGetIdCatalog(props.item.id)
                        }}
                    > */}
                    {/* <span style={{ display: "inline-block" }}>Xem</span>
                        <Icon path={mdiViewModule} size={1} />
                    </Button> */}
                    <Button className={'btn btn-edit'}
                        onClick={(e) => {
                            setIsEditing(true)
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Xác nhận xóa quyển ${name}!`)) {
                            props.deleteCatalog({ activePage: props.activePage, id: props.item.id })
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
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null)
    const [invalidImage, setInvalidImage] = useState(null)
    const [isPickedImage, setIsPickedImage] = useState(false)
    const onChangeFile = async (event) => {
        setIsPickedImage(true)
        const imageFile = event.target.files[0];

        if (!imageFile) {
            setInvalidImage('Vui lòng chọn ảnh!')
            return false;
        }

        if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
            setInvalidImage('Định dạng ảnh không hỗ trợ!')
            return false;
        }
        const res = await uploadImage(imageFile)
        if (res.err) {
            alert("Đã xảy ra lỗi khi thêm ảnh!")
        } else {
            setImageUrl(DOMAIN_IMAGE + res.fileName)
        }
        setInvalidImage(null)
    }
    // const 
    const {
        path, setPath, name, setName, material, setMaterial,
        type, setType, supplier, setSupplier,
        isEditing, setIsEditing, select
    } = props.properties
    return (
        <TableRow ref={clickOutSide} className={'my-row row-input'}>
            <TableCell style={{ position: 'relative' }}>
                {invalidImage && <p style={{ color: "red" }}>{invalidImage}</p>}
                <CellImage className="cell-image"
                    isSelectImage={props.isSelectImage}
                    isPickedImage={isPickedImage}
                    setIsPickedImage={setIsPickedImage}
                    property={imageUrl ? imageUrl : path}
                />

                <Button style={{
                    position: 'absolute',
                    'zIndex': 999,
                    'bottom': 0,
                    'right': '50%',
                    'transform': 'translate(100%, 0)',
                    'borderRadius': '10px'
                }}
                    variant="contained"
                    component="label"
                >
                    {/* Upload File */}
                    <Icon path={mdiUpload} size={1} />
                    <input
                        type="file"
                        hidden
                        onChange={(e) => onChangeFile(e)}
                    />
                </Button>

            </TableCell>

            <CellInput className="cell-name" property={name} method={setName} />
            <CellContent className="cell-type" property={props.item.agency.fraction_id !== null && props.item.agency.fraction.name} method={setType} select={select} />
            <CellContent className="cell-supplier" property={props.item.agency.supplier} method={setSupplier} select={select} />
            {/* <CellContent className="cell-supplier" property={props.item.agency.distributor.name} method={setSupplier} select={select} /> */}
            <TableCell className="cell cell-action" >
                <div className="btn-wrap">

                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => {
                            props.editCatalog({
                                id: props.id,
                                name: name,
                                imageUrl: imageUrl ? imageUrl : path,
                                type: type,
                                activePage: props.activePage
                            });
                            setIsEditing(false)
                        }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete" onClick={() => {
                        if (window.confirm(`Xác nhận xóa quyển ${name}!`)) {
                            props.deleteCatalog({ activePage: props.activePage, id: props.item.id })
                        }
                    }}>
                        <Icon path={mdiDelete} size={1} />
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
const CellImage = (props) => {
    const { property, select } = props
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        setIsLoading(property ? true : false)
    }, [property])
    const [errorLoadingImage, setErrorLoadingImage] = useState(false)
    const animationLoading = loadImg;
    return (
        <TableCell style={{ display: "flex", justifyContent: "flex-start" }} className="cell cell-image">
            <div className="cell-inner" >
                <Button className="btn-toggle"
                    onClick={() => (!props.isSelectImage) && select()}
                >
                    <input type="file" hidden />
                    {
                        props.isSelectImage ?
                            <div className="catalog-image" style={{
                                backgroundImage: `url("${props.isPickedImage ?
                                    animationLoading
                                    :
                                    (property ?
                                        property
                                        :
                                        emptyImg)
                                    }")`
                            }}>
                                <img style={{ display: "none" }} onLoad={() => { props.isSelectImage && props.setIsPickedImage(false) }} className="catalog-image" src={(property)} />
                            </div>
                            :
                            <div className="catalog-image" style={{
                                backgroundImage: `url("${isLoading ?
                                    animationLoading
                                    :
                                    (errorLoadingImage ?
                                        emptyImg
                                        :
                                        (property ?
                                            property
                                            :
                                            emptyImg))
                                    }")`
                            }}>
                                <img
                                    style={{ display: "none" }}
                                    onError={() => { setErrorLoadingImage(true); setIsLoading(false) }}
                                    onLoad={() => setIsLoading(false)}
                                    className="catalog-image"
                                    src={(property)} />
                            </div>
                    }
                </Button>
            </div>
        </TableCell>
    )
}

const CellContent = (props) => {
    const { property, select } = props
    return (
        <TableCell className="cell cell-content" >
            <div className="cell-inner">
                <Button className="btn-toggle"
                    onClick={() => select()}
                > {property} </Button>
            </div>
        </TableCell>
    )
}
const CellInput = (props) => {
    const { property, method } = props
    return (
        <TableCell className={"cell"} >
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
const CellFooter = (props) => {
    let w = window.innerWidth
    const [name, setName] = useState("");
    const CatalogPage = window.location.pathname.match('catalog');
    return (
        <TableCell colSpan={100} style={{ display: "flex", justifyContent: "center", paddingTop: "20px", flexDirection: "column", textAlign: 'right' }}>
            <Input style={{ marginRight: "0px" }} className="input-add" placeholder={props.property} onChange={(e) => setName(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                    style={{ width: "120px", marginTop: "15px", alignSelf: "flex-start" }}
                    variant="contained"
                    component="label"
                >
                    Chọn ảnh
                    <Icon path={mdiUpload} size={1} />
                    <input
                        type="file"
                        onChange={props.handleSelectFileAdd}
                        hidden
                    />
                </Button>
                <Button
                    style={{ width: "120px", marginTop: "15px", alignSelf: "flex-end", backgroundColor: "#a53f42", color: "white" }}
                    variant="contained"
                    onClick={() => props.addDispatch({ name, imageUrl: props.imageUrl })}>
                    Thêm mới
                </Button>
            </div>
        </TableCell>
    )
}
export default CatalogComponent;
