import React from 'react'
import { TextField, Typography, Button } from '@material-ui/core'
import "../../styles/scss/account-section.scss"
import {connect} from "react-redux"

const FormAccountStaff = connect(null, (dispatch) => ({
    changePass: (payload) => {
        dispatch({
            type: "CHANGE_PASS_REQUEST",
            payload
        })
    }
}))((props) => {
    const [pass, setPass] = React.useState({
        currentPassword: "",
        newPassword: ""
    })
    return (
        <div>
            <br/>
            <Typography>Mật khẩu cũ</Typography>
            <TextField type="password" variant="outlined" size="small" onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })} />
            <Typography>Mật khẩu mới</Typography>
            <TextField type="password" variant="outlined" size="small" onChange={(e) => setPass({ ...pass, newPassword: e.target.value })} />
            <p>
                <Button className="btn-update" variant="contained" size="small"
                    onClick={() => props.changePass(pass)}
                >Cập nhật</Button>
            </p>
        </div>
    )
})

export default FormAccountStaff;