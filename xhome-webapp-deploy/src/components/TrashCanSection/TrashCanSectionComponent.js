import { useEffect, useRef, useState } from 'react';
import {
    Container,
    Table, TableHead, TableBody, TableFooter,
    TableRow, TableCell,
    Button, Input, Dialog
} from '@material-ui/core';
import Icon from '@mdi/react'
import { mdiRestore, mdiClipboardEditOutline, mdiContentCopy, mdiEye } from '@mdi/js';
import SearchComponent from '../_Common/SearchComponent';
import PaginationComponent from '../_Common/PaginationComponent';
import { NavLink } from "react-router-dom";
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import '../../styles/scss/container/distributor-component.scss';
import { mdiArrowDown, mdiArrowUp } from '@mdi/js';
import { connect } from 'react-redux';

import * as actions from '../../constants/actionCreators'
const mapStateToPropsProjectManager = (state) => {
    const { listProjectManager, isLoading, activePage, totalPage, textSearch } = state.projectManagerReducer
    return { listProjectManager, isLoading, activePage, totalPage, textSearch }
}

const mapDisptachToPropsProjectManager = (dispatch) => {
    return ({
        getProjectManager: (data, isActive) => {
            dispatch(actions.getProjectManager({data, isActive}))
        },
        searchProjectManager: (data) => {
            dispatch(actions.searchProjectManagerRequest(data))
        },
        restoreProjectManager: (data) => {
            dispatch(actions.restoreProjectManagerRequest(data))
        },
        chooseProjectToUpdate: (data) => {
            dispatch(actions.chooseProjectToUpdate(data))
        },
        copyProject: (data) => {
            dispatch(actions.copyProjectRequest(data))
        }
    })
}

const HeadSearch = (props) => {
    return (
        <TableHead>
            <TableRow>
                <TableCell colSpan={100}>
                    <SearchComponent search={(data) => data.textSearch !== "" ?
                        props.searchProjectManager({
                            activePage: data.pageIndex,
                            textSearch: data.textSearch,
                            isActive: 0
                        }) : props.getProjectManager(1, 0)} />
                </TableCell>
            </TableRow>
        </TableHead>
    )
}

const TrashCanSectionComponent = connect(mapStateToPropsProjectManager, mapDisptachToPropsProjectManager)((props) => {
    useEffect(() => { props.getProjectManager(1, 0) }, []);
    const [activeSort, setActiveSort] = useState([null, null, false]);
    // const [afterSort, setAfterSort] = useState(props.listProjectManager);
    const [listData, setListData] = useState([])
    useEffect(() => {
        setListData(props.listProjectManager)
    }, [props.listProjectManager])

    const sortString = (arr, property) => arr.sort(function (a, b) {
        let stringA = a[property].toLowerCase(), stringB = b[property].toLowerCase();
        if (stringA < stringB) return -1;
        if (stringA > stringB) return 1;
        return 0;
    })

    const sortStringReverse = (arr, property) => {
        arr.sort(function (a, b) {
            let stringA = a[property].toLowerCase(), stringB = b[property].toLowerCase();
            if (stringA < stringB) return -1;
            if (stringA > stringB) return 1;
            return 0;
        })
        return arr.reverse()
    }

    const sortDate = (arr, property) => arr.sort(function (a, b) {
        var dateA = new Date(a[property]), dateB = new Date(b[property]);
        return dateA - dateB;
    })

    const sortDateReverse = (arr, property) => {
        arr.sort(function (a, b) {
            var dateA = new Date(a[property]), dateB = new Date(b[property]);
            return dateA - dateB;
        })
        return arr.reverse()
    }
    const handleSort = (idx) => {
        setActiveSort(activeSort.map((item, key) => {
            if (idx === key) {
                if (item === null) {
                    return true
                } else {
                    return !item
                }
            } else {
                return null
            }
        }))
        switch (idx) {
            case 0:
                setListData(activeSort[idx] === null || activeSort[idx] === false ?
                    sortString(listData, "contractId") : sortStringReverse(listData, "contractId"))
                break;
            case 1:
                setListData(activeSort[idx] === null || activeSort[idx] === false ?
                    sortString(listData, "customerName") : sortStringReverse(listData, "customerName"))
                break;
            default:
                setListData(activeSort[idx] === null || activeSort[idx] === false ?
                    sortDate(listData, "created_at") : sortDateReverse(listData, "created_at"))
                break;
        }
    }
    const Head = () => {
        return (
            <TableHead>
                <TableRow className="cell-title">
                    <TableCell className="cell-header" onClick={() => handleSort(0)}>
                        <div className='cell-head' style={{ display: 'inline-block', fontSize: 18 }}> Mã Hợp Đồng </div>
                        {activeSort[0] === null ?
                            <Icon path={mdiArrowUp} size={1} className='arrow' />
                            :
                            <Icon path={activeSort[0] ? mdiArrowUp : mdiArrowDown} size={1} className="display-arrow" />
                        }
                        {/* {activeSort[0] !== null ? 
                            <Icon path={activeSort[0] ? mdiArrowUp : mdiArrowDown} size={1} style={{ marginBottom: 5, transform:'scale(0.8)', opacity: 1, transition: '0.3s' }} />
                        :
                            <Icon path={activeSort[0] ? mdiArrowUp : mdiArrowDown} size={1} style={{ marginBottom: 5, transform:'scale(0.8)', opacity: 0, transition: '0.3s' }} />
                        } */}
                    </TableCell>
                    <TableCell className="cell-header" onClick={() => handleSort(1)}>
                        <div className='cell-head' style={{ display: 'inline-block', fontSize: 18 }}> Họ Tên Khách Hàng </div>
                        {activeSort[1] === null ?
                            <Icon path={mdiArrowUp} size={1} className='arrow' />
                            :
                            <Icon path={activeSort[1] ? mdiArrowUp : mdiArrowDown} size={1} className="display-arrow" />
                        }
                    </TableCell>
                    <TableCell className="cell-header">
                        <div className='cell-head' style={{ display: 'inline-block', fontSize: 18 }}> Người Tạo </div>
                    </TableCell>
                    <TableCell className="cell-header" onClick={() => handleSort(2)}>
                        <div className='cell-head' style={{ display: 'inline-block', fontSize: 18 }}> Thời Gian </div>
                        {activeSort[2] === null ?
                            <Icon path={mdiArrowUp} size={1} className='arrow' />
                            :
                            <Icon path={activeSort[2] ? mdiArrowUp : mdiArrowDown} size={1} className="display-arrow" />
                        }
                    </TableCell>
                    <TableCell className="cell-header" style={{ textAlign: 'right', padding: '0.5em 0' }}>
                        <div className='cell-head' style={{ display: 'inline-block', fontSize: 18 }}> Hành động </div>
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
    const Body = () => {
        return (
            <TableBody>
                {listData.map((item, idx) => {
                    if (item && !item.isActive) {
                        return <Item key={idx} item={item}
                            restoreProjectManager={props.restoreProjectManager} chooseProjectToUpdate={props.chooseProjectToUpdate} copyProject={props.copyProject} />
                    }
                })}
            </TableBody>
        )
    }
    const Footer = () => {
        return (
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={100}>
                        <PaginationComponent
                            totalPage={props.totalPage}
                            activePage={props.activePage}
                            onPaginate={(pageIndex) => {
                                props.textSearch !== "" ?
                                    props.searchProjectManager({
                                        activePage: pageIndex,
                                        textSearch: props.textSearch,
                                        isActive: 0
                                    }) : props.getProjectManager(pageIndex, 0)
                                setActiveSort([null, null, false])
                            }}
                        />
                    </TableCell>
                </TableRow>
            </TableFooter>
        )
    }
    return (
        <div className="my-table distributor-component">
            <Container>
                <Table>
                    {/* <HeadSearch {...props} /> */}
                    <Head {...props} />
                    {props.isLoading ?
                        <TableCell colSpan={100}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img style={{ width: "30%" }} src={loadImg} alt="loading" />
                            </div>
                        </TableCell>
                        :
                        <Body />
                    }
                    <Footer />
                </Table>
            </Container>
        </div>
    )
})

const Item = (props) => {
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [email, setEmail] = useState('')
    const [isEditing, setIsEditing] = useState(false);
    function select(e) {
        // let a = document.getElementsByClassName('selected')
        // let selectedItem = e.closest('tr')
        // if (a.length > 0) {
        //     a[0].classList.remove("selected")
        // }
        // selectedItem.classList.add('selected')
    }
    useEffect(() => {
        setName(props.item.name)
        setNumber(props.item.number)
        setEmail(props.item.email)
    }, [props.item])
    let properties = {
        name, setName, number, setNumber, email, setEmail,
        isEditing, setIsEditing, select
    }
    return (
        <>
            {
                !isEditing
                    ? <RowContent properties={properties} item={props.item} restoreProjectManager={props.restoreProjectManager}
                        chooseProjectToUpdate={props.chooseProjectToUpdate} copyProject={props.copyProject} />
                    : <RowInput properties={properties} item={props.item} />
            }
        </>
    )
}
const convertDate = (dateBE) => {
    let date = new Date(dateBE);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    let hour = date.getHours()
    let minute = date.getMinutes()

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    let converted = hour + ":" + minute + " - " + dt + '/' + month + '/' + year

    return converted
}

const RowContent = (props) => {
    const {
        isEditing, setIsEditing,
        select
    } = props.properties
    const [openModalConfirmRestore, setOpenModalConfirmRestore] = useState(false)
    const [openModalConfirmCopy, setOpenModalConfirmCopy] = useState(false)
    const isAdmin = JSON.parse(localStorage.getItem('UI')) !== null && JSON.parse(localStorage.getItem('UI')).isAdmin;
    return (
        <TableRow className={'my-row row-content'}>
            <CellContent className="cell-name" property={props.item.contractId} select={select} />
            <CellContent className="cell-number" property={props.item.customerName} select={select} />
            <CellContent className="cell-email" property={props.item.account.fullName} select={select} />
            <CellContent className="cell-email" property={convertDate(props.item.created_at)} select={select} />
            <TableCell className="cell cell-action">
                <div className="btn-wrap">
                    {/* <Button className={'btn btn-edit'} onClick={() => {
                        setOpenModalConfirmCopy(true)
                    }}
                    >
                        <Icon path={mdiContentCopy} size={1} />
                    </Button> */}
                    <NavLink to="/dashboard/project-creation" >
                        <Button className={'btn btn-edit'}
                            // onClick={(e) => {
                            //     setIsEditing(true)
                            // }}
                            // href="/dashboard/project-creation"
                            onClick={() => {
                                localStorage.setItem("lastActProjectForm", "UPDATE")
                                props.chooseProjectToUpdate({ item: props.item, typeEditor: "trashCan" })
                            }}
                        >
                            <Icon path={mdiEye} size={1} />
                        </Button>
                    </NavLink>
                    <Button className="btn btn-delete" onClick={() => setOpenModalConfirmRestore(true)}>
                        <Icon path={mdiRestore} size={1} />
                    </Button>
                    <Dialog
                        open={openModalConfirmRestore}
                        onClose={() => setOpenModalConfirmRestore(false)}
                    >
                        {isAdmin === 1 ?
                            <div style={{ padding: '40px 50px', backgroundColor: '#3327281c', textAlign: "center" }}>
                                <p>Xác nhận khôi phục dự án!</p>
                                <Button
                                    color="secondary"
                                    style={{ padding: '10px 19px', backgroundColor: '#3327281c' }}
                                    onClick={() => { props.restoreProjectManager(props.item) }}
                                > Khôi phục
                                </Button>
                                <Button
                                    style={{ marginLeft: '20px', padding: '10px 30px', backgroundColor: '#3327281c' }}
                                    onClick={() => { setOpenModalConfirmRestore(false) }}
                                > Hủy </Button>
                            </div>
                            :
                            <div style={{ padding: '40px 50px', backgroundColor: '#3327281c', textAlign: "center" }}>
                                <p>Bạn không phải admin không thể khôi phục dự án!</p>
                                <Button
                                    style={{ marginLeft: '20px', padding: '10px 30px', backgroundColor: '#3327281c' }}
                                    onClick={() => { setOpenModalConfirmRestore(false) }}
                                > Hủy </Button>
                            </div>
                        }

                    </Dialog>

                    <Dialog
                        open={openModalConfirmCopy}
                        onClose={() => setOpenModalConfirmCopy(false)}
                    >
                        {/* {isAdmin === 1 ? */}
                        <div style={{ padding: '40px 50px', backgroundColor: '#3327281c', textAlign: "center" }}>
                            <p>Xác nhận sao chép dự án!</p>
                            <Button
                                color="secondary"
                                style={{ padding: '10px 20px', backgroundColor: '#3327281c' }}
                                onClick={() => {
                                    props.copyProject(props.item.id)
                                    setOpenModalConfirmCopy(false)
                                }}
                            > Đồng ý
                            </Button>
                            <Button
                                style={{ marginLeft: '20px', padding: '10px 30px', backgroundColor: '#3327281c' }}
                                onClick={() => { setOpenModalConfirmCopy(false) }}
                            > Hủy </Button>
                        </div>
                        {/* :
                            <div style={{ padding: '40px 50px', backgroundColor: '#3327281c', textAlign: "center" }}>
                                <p>Bạn không phải admin không thể xóa dự án!</p>
                                <Button
                                    style={{ marginLeft: '20px', padding: '10px 30px', backgroundColor: '#3327281c' }}
                                    onClick={() => { setOpenModalConfirmDelete(false) }}
                                > Hủy </Button>
                            </div> */}
                        {/* } */}

                    </Dialog>
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
    const { item, setIsEditing } = props.properties
    return (
        <TableRow ref={clickOutSide} className={'my-row row-input'}>
            <CellInput className="cell-name" property={props.item.contractId} />
            <CellInput className="cell-number" property={props.item.customerName} />
            <CellInput className="cell-email" property={props.item.account.fullName} />
            <CellInput className="cell-email" property={props.item.created_at} isDate={true} />
            <TableCell className="cell cell-action">
                <div className="btn-wrap">

                    <Button className={'btn btn-edit btn-update'}
                        onClick={() => { setIsEditing(false) }}>
                        <Icon path={mdiClipboardEditOutline} size={1} />
                    </Button>
                    <Button className="btn btn-delete">
                        {/* <Icon path={mdiDelete} size={1} /> */}
                    </Button>
                </div>
            </TableCell>
        </TableRow >
    )
}
const CellContent = (props) => {
    const { property, select } = props;
    return (
        <TableCell className={`cell ${props.className}`}>
            <div className="cell-inner">
                <Button className="btn-info-toggle"
                    onClick={(e) => {
                        select(e.target)
                    }}
                > {property} </Button>
            </div>
        </TableCell>
    )
}
const CellInput = (props) => {
    const { property, isDate, method } = props
    return (
        <TableCell className={"cell"} >
            <div className="cell-inner">
                <Input
                    disabled={isDate ? true : false}
                    className="isEditing"
                    value={property}
                    onChange={(e) => method(e.target.value)}
                />
            </div>
        </TableCell>
    )
}
const CellFooter = (props) => {
    return (
        <TableCell className="cell-input-add" >
            <Input className="input-add" placeholder={props.property} />
        </TableCell>
    )
}
export default TrashCanSectionComponent;
