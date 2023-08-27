import TrashCanSectionComponent from './TrashCanSectionComponent'
import '../../styles/scss/distributor-section.scss'
import { Button, Dialog, Divider, } from '@material-ui/core'
import ProjectCreation from '../ProjectCreationSection/index'
import { NavLink } from "react-router-dom";
import { useState } from 'react'
const ProjectSection = ({ pageTitle }) => {
    return (
        <div className="container">
            {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '20px 0' }}>
                <h1 style={{ display: "inline", margin: 0 }}>{pageTitle}</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <NavLink to="/dashboard/project-creation">
                        <Button
                            className="btn-create-project"
                            // href="/dashboard/project-creation"
                            onClick={() => localStorage.setItem("lastActProjectForm", "ADD")}
                        >Khởi Tạo Dự Án
                    </Button>
                    </NavLink> */}
                    {/* <Dialog
                        open={openDialog}
                    >
                    </Dialog> */}
                    {/* <Button 
                            style ={{backgroundColor : 'red'}}
                            onClick={()=>{setOpenDialog(true)}}
                        >Khởi Tạo Dự Án</Button>    */}
                    {/* <ProjectCreation handleOpen = {openDialog} /> */}
                {/* </div>
            </div> */}
            <Divider />
            <div className="main-content">
                <div className="my-col first distributor-col">

                    <div className="wrap-table">
                        <TrashCanSectionComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProjectSection;

