import { useState, useEffect } from 'react';
import { Input, Button, OutlinedInput } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiPlus, mdiPlusBoxMultiple } from '@mdi/js';
import '../../styles/scss/common/search-component.scss'

const AddSegment = () => {
    return (
        <div className="add-segment-wrap">
            <OutlinedInput
                className="add-segment-input"
                placeholder="Thêm phân khúc"
                endAdornment={
                    <Button
                        variant="contained"
                        className="add-btn"
                    >
                        <Icon path={mdiPlus} size={1} />
                    </Button>
                }
            />
        </div>
    )
}

export default AddSegment