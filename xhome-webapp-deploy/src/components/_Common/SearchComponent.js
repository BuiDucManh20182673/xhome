import { useState, useEffect } from 'react';
import { Input, Button, OutlinedInput, debounce } from '@material-ui/core'
import Icon from '@mdi/react'
import { mdiMagnify } from '@mdi/js';
import '../../styles/scss/common/search-component.scss'

const SearchComponent = (props) => {
    return (
        <div>
            <OutlinedInput
                className="search-input"
                placeholder="Tìm kiếm"
                //defaultValue={props.textSearch}
                onChange={debounce((e) => props.search({
                    textSearch: e.target.value,
                    pageIndex: 1
                }), 600)}
                autoFocus={window.innerWidth > 768}
                onKeyPress={(e) => e.key === "Enter" && props.search({
                    textSearch: e.target.value,
                    pageIndex: 1
                })}
                endAdornment={
                    <Button
                        variant="contained"
                        className="search-btn"
                    >
                        <Icon path={mdiMagnify} size={1} />
                    </Button>
                }
            />
        </div>
    )
}

export default SearchComponent