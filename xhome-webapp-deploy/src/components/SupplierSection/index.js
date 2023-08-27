import React, { useState, useEffect, useRef } from 'react'
import SupplierComponent from '../_Container/SupplierComponent'
import '../../styles/scss/supplier-section.scss'
import { mdiDelete, mdiClipboardEditOutline } from '@mdi/js';
import { connect } from "react-redux"
import { Divider, Button, Input } from '@material-ui/core'
import PaginationComponent from '../_Common/PaginationComponent'
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import '../../styles/scss/container/distributor-component.scss'
import {
  getDistributorBySupNameRequest, addDistributorBySupNameRequest,
  updateDistributorBySupNameRequest, deleteDistributorBySupNameRequest
} from "../../constants/actionCreators"
import {
  Container, TableHead,
  Table, TableBody, TableFooter,
  TableRow, TableCell
} from '@material-ui/core';
import Icon from '@mdi/react'

const Head = (props) => {
  return (
    <TableHead>
      <TableRow className="cell-title">
        <TableCell>
          <div className='cell-head' style={{ fontSize: 18 }}> Tên nhà phân phối </div>
        </TableCell>
        <TableCell >
          <div className='cell-head' style={{ fontSize: 18 }}> Số điện thoại </div>
        </TableCell>
        <TableCell >
          <div className='cell-head' style={{ fontSize: 18 }}> Email </div>
        </TableCell>
        {(window.location.pathname.match("material") || (JSON.parse(localStorage.getItem("UI")).isAdmin === 1)) &&
          <TableCell style={{ display: "flex", justifyContent: "flex-end", padding: '0.5em', fontSize: 18 }} >
            <div className='cell-head'>Hành động</div>
          </TableCell>}
      </TableRow>
    </TableHead>
  )
}
const mapStateToProps = (state) => {
  const { listDataDistributor, activePageDistributor, totalPageDistributor, textSearchDistributor, isLoadingDistributor, choosedName } = state.supplier
  return {
    listData: listDataDistributor,
    activePage: activePageDistributor,
    totalPage: totalPageDistributor,
    textSearch: textSearchDistributor,
    isLoading: isLoadingDistributor,
    choosedName
  }
}

const mapDispatchToProps = (dispatch) => ({
  getDispatch: (data) => {
    dispatch(getDistributorBySupNameRequest(data))
  },
  addDispatch: (data) => {
    dispatch(addDistributorBySupNameRequest(data))
  },
  updateDispatch: (data) => {
    dispatch(updateDistributorBySupNameRequest(data))
  },
  deleteDispatch: (data) => {
    dispatch(deleteDistributorBySupNameRequest(data))
  }
})
const DistributorComponent = connect(mapStateToProps, mapDispatchToProps)((props) => {
  useEffect(() => props.getDispatch(1), [props.choosedName])
  const Body = () => {
    return (
      <TableBody>
        {props.listData.map((item, idx) => {
          return <Item
            key={idx}
            item={item}
            onChoose={props.onChoose}
            deleteDispatch={props.deleteDispatch}
            updateDispatch={props.updateDispatch}
          />
        })}
      </TableBody>
    )
  }

  const Footer = () => {
    const [distributor, setDistributor] = useState({
      name: "",
      email: "",
      tel: 0
    })
    return (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={100}>
            <PaginationComponent
              totalPage={props.totalPage}
              activePage={props.activePage}
              onPaginate={(pageIndex) => props.getDispatch(pageIndex)}
            />
          </TableCell>
        </TableRow>
        {JSON.parse(localStorage.getItem("UI")).isAdmin === 1 &&
          <TableRow>
            <CellFooter property={"Nhà phân phối"} onChange={(val) => setDistributor({ ...distributor, name: val })} />
            <CellFooter property={"Số điện thoại"} onChange={(val) => setDistributor({ ...distributor, tel: val })} />
            <CellFooter property={"Email"} onChange={(val) => setDistributor({ ...distributor, email: val })} />
            <TableCell className="cell-btn-add" style={{ textAlign: 'right' }}>
              <Button variant="contained" className="btn-add--form" onClick={() => {
                props.addDispatch(distributor)
              }}>
                Thêm mới
                      </Button>
            </TableCell>
          </TableRow>}

      </TableFooter>
    )
  }
  return (
    <div className="my-table distributor-component">
      <Container>

        <Table>
          <Head isloading={props.isLoading} />
          {props.isLoading
            ?
            <TableCell colSpan={100}>
              <div style={{ display: "flex", justifyContent: "center" }} >
                <img width="20%" src={loadImg} />
              </div>
            </TableCell>
            :
            props.listData.length > 0 && <Body />
          }
          <Footer />
        </Table>


      </Container>
    </div >
  )
})

const Item = (props) => {
  const [distributor, setDistributor] = useState({})
  const [isEditing, setIsEditing] = useState(false);
  const setDistributorState = (att, val) => {
    setDistributor({ ...distributor, [att]: val })
  }
  useEffect(() => {
    setDistributor(props.item)
  }, [props.item])
  return (!isEditing ? <RowContent distributor={distributor} onChoose={props.onChoose} setIsEditing={setIsEditing} deleteDispatch={props.deleteDispatch} />
    : <RowInput distributor={distributor} setDistributorState={setDistributorState}
      updateDispatch={props.updateDispatch} deleteDispatch={props.deleteDispatch} setIsEditing={setIsEditing} />)
}

const RowContent = (props) => {
  const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
  return (
    <TableRow className={'my-row row-content'}>
      <CellContent className="cell-name" property={props.distributor.name} />
      { isAdmin ? <CellContent className="cell-number" property={props.distributor.tel} /> : <CellContent className="cell-number" property={"Không có quyền"} />}
      { isAdmin ? <CellContent className="cell-email" property={props.distributor.email} /> : <CellContent className="cell-email" property={"Không có quyền"} />}

      <TableCell className="cell cell-action" style={{ textAlign: 'right' }}>

        {window.location.pathname.match("material") ?
          <Button variant="contained" color="inherit" onClick={() => props.onChoose(props.distributor)}>Chọn</Button>
          :
          (JSON.parse(localStorage.getItem("UI")).isAdmin === 1 &&
            <div className="btn-wrap">
              <Button
                className={'btn btn-edit'}
                onClick={(e) => {
                  props.setIsEditing(true)
                }}>
                <Icon path={mdiClipboardEditOutline} size={1} />
              </Button>
              <Button
                className="btn btn-delete"
                onClick={() => {
                  if (window.confirm(`Xác nhận xóa nhà phân phối ${props.distributor.name}!`)) {
                    props.deleteDispatch(props.distributor.id)
                  }
                }}
              >
                <Icon path={mdiDelete} size={1} />
              </Button>
            </div>)
        }

      </TableCell>
    </TableRow >
  )
}
const CellContent = (props) => {
  const { property, select } = props
  return (
    <TableCell className={`cell ${props.className}`}>
      <div className="cell-inner" style={{ padding: 6 }}>
        {property}
      </div>
    </TableCell>
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
  const isAdmin = JSON.parse(localStorage.getItem("UI")).isAdmin
  const {
    distributor, setDistributorState, updateDispatch, deleteDispatch,
    isEditing, setIsEditing,
    select } = props
  useOnClickOutside(clickOutSide, () => setIsEditing(false));
  return (
    <TableRow ref={clickOutSide} className={'my-row row-input'}>
      <CellInput className="cell-name" property={distributor.name} method={(val) => setDistributorState("name", val)} />
      { isAdmin ? <CellInput className="cell-number" type="number" property={distributor.tel} method={(val) => setDistributorState("tel", val)} /> : <CellContent className="cell-number" property={""} select={select} />}
      { isAdmin ? <CellInput className="cell-email" property={distributor.email} method={(val) => setDistributorState("email", val)} /> : <CellContent className="cell-email" property={""} select={select} />}
      <TableCell className="cell cell-action" >
        <div className="btn-wrap">
          <Button className={'btn btn-edit btn-update'}
            onClick={() => {
              setIsEditing(false);
              updateDispatch(distributor);
            }}>
            <Icon path={mdiClipboardEditOutline} size={1} />
          </Button>
          <Button className="btn btn-delete" onClick={() => {
            if (window.confirm(`Xác nhận xóa nhà phân phối ${distributor.name}!`)) {
              props.deleteDispatch(distributor.id)
            }
          }}>
            <Icon path={mdiDelete} size={1} />
          </Button>
        </div>
      </TableCell>
    </TableRow >
  )
}

const CellInput = (props) => {
  const { property, method, type } = props
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
  return (
    <TableCell className="cell-input-add" >
      {
        <Input className="input-add" placeholder={props.property} onChange={(e) => props.onChange(e.target.value)} />
      }
    </TableCell>
  )
}

const Supplier = (props) => {
  const [openTabMaterial, setOpenTabMaterial] = useState(false);
  return (
    <div className="container">
      <h1>Nhà phân phối</h1>
      {openTabMaterial
        ?
        <Button variant="contained" className="btn-back-supplier" onClick={() => setOpenTabMaterial(false)}>Quay lại</Button>
        :
        window.location.pathname.match('material') && window.innerWidth <= 768 ?
          <Button variant="contained" className="btn-back-supplier" onClick={() => props.setOpenModalChoose(false)}>Quay lại</Button>
          :
          null
      }
      <Divider />
      <div className="main-content">
        <div className="my-col second supplier-col"
          // style={window.innerWidth <= 768 ? { width: "100%" } : { width: '30%' }}
          style={window.innerWidth <= 768 ? openTabMaterial ? { display: 'none' } : { display: 'block', width: "100%" } : { width: '30%' }}
        >
          <h4>Nhà cung cấp</h4>
          <div className="wrap-table">
            {window.innerWidth <= 768 ?
              <SupplierComponent openTabMaterial={() => setOpenTabMaterial(true)} />
              :
              <SupplierComponent openTabMaterial={() => setOpenTabMaterial(false)} />
            }
          </div>
        </div>
        {props.choosedName !== "" ?
          window.innerWidth <= 768 ?
            <div className="my-col first distributor-col" style={!openTabMaterial ? { display: 'none' } : { display: 'block' }}>
              <h4>Nhà phân phối</h4>
              <div className="wrap-table">

                <DistributorComponent onChoose={props.onChoose} />
              </div>
            </div>
            :
            <div className="my-col first distributor-col">
              <h4>Nhà phân phối</h4>
              <div className="wrap-table">
                <DistributorComponent onChoose={props.onChoose} />
              </div>
            </div>
          :
          null
        }
      </div>
      {/* <input hidden ref={(el) => { demoEnd = el; }} /> */}
    </div>
  )
};

export default connect((state) => ({
  choosedName: state.supplier.choosedName
}))(Supplier);
