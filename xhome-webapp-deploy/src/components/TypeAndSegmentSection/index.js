import React, { useState } from 'react'
// import TypeComponent from '../_Container/TypeComponent'
import MaterialComponent from "../_Container/MaterialComponent"
import SegmentComponent from '../_Container/SegmentComponent'
import { updateFractionRequest, deleteFractionRequest, addFractionRequest, getFractionRequest } from "../../constants/actionCreators"
import { Divider, Button } from '@material-ui/core'
import '../../styles/scss/type-and-segment-section.scss'
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        listFraction: state.fraction.listData,
        activePage: state.fraction.activePage,
        totalPage: state.fraction.totalPage,
        isLoading: state.fraction.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFraction: (data) => {
            dispatch(getFractionRequest(data))
        },
        editFraction: (data) => {
            dispatch(updateFractionRequest(data))
        },
        deleteFraction: (data) => {
            dispatch(deleteFractionRequest(data))
        },
        addFraction: (data) => {
            dispatch(addFractionRequest(data))
        }
    }
}
const TypeAndSegment = connect(mapStateToProps, mapDispatchToProps)(props => {
    const [openTabMaterial, setOpenTabMaterial] = useState(false);
    return (
        <div className="container">
            <h1>{props.pageTitle}</h1>
            {openTabMaterial && <Button variant="contained" className="btn-back" onClick={() => setOpenTabMaterial(false)}>Quay lại</Button>}
            <Divider />
            <div className="main-content">
                {/* <div className="my-col first type-col" style={openTabMaterial ? { display: 'none' } : { display: 'block' }}>
                    <h3>Vật liệu</h3>
                    {window.innerWidth <= 768 ?
                        <MaterialComponent
                            openTabMaterial={() => setOpenTabMaterial(true)}
                        />
                        :
                        <MaterialComponent
                            openTabMaterial={() => setOpenTabMaterial(false)}
                        />
                    }
                </div> */}
                {window.innerWidth <= 768 ?
                    <div className="my-col second segment-col">
                        {/* <h3>{props.pageTitle}</h3> */}
                        <SegmentComponent {...props} />
                    </div>
                    :
                    <div className="my-col second segment-col">
                        {/* <h3>{props.pageTitle}</h3> */}
                        <SegmentComponent {...props} />
                    </div>
                }
            </div>
        </div>
    )
});

export default TypeAndSegment;