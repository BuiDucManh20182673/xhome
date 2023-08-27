// import React from "react";
// import { connect } from "react-redux";
// import { doFetchProjects } from "../../constants/actionCreators";
// import { getReadableProjects } from "../../selectors/project";
// import demoProjectImg from "../../styles/images/demo-project-01.jpg";
// import { Divider, Typography } from '@material-ui/core'
// import "../../styles/scss/project-section.scss";
// const Projects = ({ projects, onFetch, pageTitle }) => (
//   <div className="project-container">
//     <h1>{pageTitle}</h1>
//     <Divider />
//     {(projects || []).map((project) => (
//       <Project key={project.id} project={project} />
//     ))}
//     {/* <button onClick={onFetch}>Fetch</button> */}
//     <div className="inner-container">
//       {[1, 1, 1, 1].map((v1, i) => (
//         <div key={i} className="monthly-project-wrapper">
//           <div className="monthly-project-tab">
//             <div className="title">Dự án tháng 11/2020</div>
//             <button>Xem tất cả</button>
//           </div>
//           <div className="triple-projects-wrapper">
//             {[1, 1].map((v2, j) => (
//               <div key={j * 10} className="project-item">
//                 <span>Mã HĐ TK</span>
//                 <span>Họ và tên khách hàng</span>
//                 <span>Người tạo - Thời gian tạo </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Project = ({ project }) => (
//   <div>
//     <h1>{project.name}</h1>
//   </div>
// );

// const mapStateToProps = (state) => ({
//   projects: getReadableProjects(state),
// });

// const action = doFetchProjects({ query: "" });
// const mapDispatchToProps = (dispatch) => ({
//   onFetch: (id) => dispatch(action),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Projects);


import SupplierComponent from '../_Container/SupplierComponent'
import ProjectSectionComponent from './ProjectSectionComponent'
import '../../styles/scss/distributor-section.scss'
import { Button, Dialog, Divider, } from '@material-ui/core'
import { connect } from 'react-redux'
import ProjectCreation from '../ProjectCreationSection/index'
import { NavLink} from "react-router-dom";
import { useState } from 'react'
const ProjectSection = ({ pageTitle }) => {
    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '20px 0' }}>
                <h1 style={{ display: "inline", margin: 0 }}>{pageTitle}</h1>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <NavLink to="/dashboard/project-creation">
                        <Button
                            className="btn-create-project"
                            // href="/dashboard/project-creation"
                            onClick={() => localStorage.setItem("lastActProjectForm", "ADD")}
                        >Khởi Tạo Dự Án
                    </Button>
                    </NavLink>
                    {/* <Dialog
                        open={openDialog}
                    >
                    </Dialog> */}
                    {/* <Button 
                            style ={{backgroundColor : 'red'}}
                            onClick={()=>{setOpenDialog(true)}}
                        >Khởi Tạo Dự Án</Button>    */}
                    {/* <ProjectCreation handleOpen = {openDialog} /> */}
                </div>
            </div>
            <Divider />
            <div className="main-content">
                <div className="my-col first distributor-col">

                    <div className="wrap-table">
                        <ProjectSectionComponent />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProjectSection;



