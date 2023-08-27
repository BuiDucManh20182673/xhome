import React from 'react'
import { Divider } from '@material-ui/core'
import "../../styles/scss/list-pending-section.scss"
import TabCategoryPending from "./TabCategory"
const ListPendingSection = (props) => {
    return (
        <div className="container">
            <h1>{props.pageTitle}</h1>
            <Divider />
            <div className="main-content">
                <div className="my-col first category-col">
                    <TabCategoryPending />
                </div>
                <div className="my-col second ">
                </div>
            </div>
        </div>
    )
}

export default ListPendingSection;

