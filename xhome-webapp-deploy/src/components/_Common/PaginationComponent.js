import Pagination from '@material-ui/lab/Pagination';
import "../../styles/scss/common/pagination-component.scss"

// props :
// totalPage: Tổng số trang
// activePage: Trang hiện tại để hiển thị
// onPaginate: hàm được chạy khi chuyển trang
const PaginationComponent = (props) => {
    return (
        <Pagination
            className="pagination-component"
            count={props.totalPage} color="primary"
            page={props.activePage}
            onChange={(e, val) => {
                if(val !== props.activePage){
                    props.onPaginate(val)
                }
            }}
        />
    )
}

export default PaginationComponent;