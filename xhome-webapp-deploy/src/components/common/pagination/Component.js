import React from "react"
import Pagination from '@material-ui/lab/Pagination';
export default (props) => {
    return(
        <Pagination className="paginate" count={props.totalPage} color="primary" onChange={(e, val) => props.onPaginate(val)} />
    )
}