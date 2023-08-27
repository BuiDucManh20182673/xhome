import React, { useState, useEffect, useRef } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Container, Divider, Button, Typography,
  TextField, OutlinedInput,
} from '@material-ui/core';
import { ListMaterialsMobile } from '../_Container/ProductComponent'
import { SelectedMaterialMobile } from '../_Container/ProductSelectedComponent'
import { AddNewProductMobile } from '../_Common/ModalProduct'
import { CardArea } from '../_Container/AreaComponent'
import "../../styles/scss/project-creation-section.scss"
import * as actions from "../../constants/actionCreators"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux"
import PDF from "./ProjectCreationPDF"
import { BlobProvider } from '@react-pdf/renderer'
import callAPI from '../../api/callAPI'
const ProjectCreation = (props) => {
  const [screen, setScreen] = useState('project-creation')
  const widthScreen = window.innerWidth
  return (
    <div>
      {screen === 'project-creation' ?
        <ViewProjectCreation {...props}
          widthScreen={widthScreen}
          handleScreen={() => setScreen('list-materials')}
        />
        : (screen === 'list-materials') ?
          <ListMaterialsMobile
            handleScreenSelectedMaterial={() => setScreen('selected-materials')}
            handleScreenAddNewMaterial={() => setScreen('add-new-materials')}
            handleScreenProjectCreation={() => setScreen('project-creation')}
          />
          : (screen === 'selected-materials') ?
            <SelectedMaterialMobile />
            : (screen === 'add-new-materials') &&
            <AddNewProductMobile
              handleClose={() => setScreen('list-materials')}
            />
      }
    </div>
  );
};

export default ProjectCreation;

const mapStateToProps = (state) => {
  return {
    projectReducer: state.projectReducer,
    isLoadingSave: state.projectReducer.isLoadingSave
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addArea: (data) => {
      dispatch(actions.addAreaAction(data))
    },
    addCodeContract: (data) => {
      dispatch(actions.addCodeContractAction(data))
    },
    addCustomer: (data) => {
      dispatch(actions.addCustomerAction(data))
    },
    saveProject: (project) => {
      dispatch(actions.saveProjectRequest(project))
    },
    updateProject: (project) => {
      dispatch(actions.updateProjectRequest(project))
    },
    dropProject: (project) => {
      dispatch(actions.dropProjectRequest(project))
    },
    saveProjectLocalDispatch: () => {
      dispatch({
        type: "SAVE_PROJECT_TO_LOCAL"
      })
    },
    saveProjectFromLocal: (payload) => {
      dispatch({
        type: "SAVE_PROJECT_FROM_LOCAL"
      })
    },
  }
}

const EnterCodeAndCustomerName = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [codeContract, setCodeContract] = useState('');
  const [area, setArea] = useState('');
  const [customer, setCustomer] = useState('');
  useEffect(() => {
    if (props.projectReducer.project.codeContract === null) {
      setCodeContract('')
    }
    if (props.projectReducer.project.customer === null) {
      setCustomer('')
    }
    if (props.projectReducer.project.customer !== null) {
      setCustomer(props.projectReducer.project.customer)
    }
    if (props.projectReducer.project.codeContract !== null) {
      setCodeContract(props.projectReducer.project.codeContract);
    }
  }, [props])
  const handleAddCodeContract = (value) => {
    if (value !== '') {
      props.addCodeContract(value)
      setCodeContract(value)
    }
  }

  const handleAddCustomer = (value) => {
    if (value !== '') {
      props.addCustomer(value)
      setCustomer(value)
    }
  }

  const handleAddArea = () => {
    // if (area !== '') {
    props.addArea({ area: area, activePage: 1, openListAll: false })
    setArea('')
    // }
  }
  console.log("propssss ", props);
  return (
    <div className={"block-info flex-block-info"}>
      <div className="block-info-inner">

        <div>
          <Typography className={"block-info-title"}>Mã HĐ TK</Typography>
          <TextField key="contractCKey" className={`block-info-input block-info-input--default`} variant="outlined" size="small"
            value={codeContract}
            onChange={(e) => {
              setCodeContract(e.target.value)
            }}
            onBlur={() => {
              handleAddCodeContract(codeContract)
            }}
          />
          <Typography className={"block-info-title"}>Họ và tên khách hàng</Typography>
          <TextField key="customerKey" className={'block-info-input block-info-input--default'} variant="outlined" size="small"
            value={customer}
            onChange={(e) => {
              setCustomer(e.target.value)
            }}
            onBlur={() => {
              handleAddCustomer(customer)
            }}
          />
          <label className={`form-add-area`}>
            <OutlinedInput
              key="areaKey"
              className="input-add-area"
              placeholder="Thêm khu vực"
              onChange={(e) => setArea(e.target.value)}
              value={area}
              endAdornment={
                <Button
                  variant="contained"
                  className="btn-add-area"
                  onClick={() => handleAddArea()}
                >Thêm</Button>
              }
            />
          </label>
        </div>
      </div>
    </div>
  )
})

const useUnload = fn => {
  const cb = useRef(fn);

  useEffect(() => {
    cb.current = fn;
  }, [fn]);

  useEffect(() => {
    const onUnload = cb.current;

    window.addEventListener("unload", onUnload);

    return () => window.removeEventListener("unload", onUnload);
  }, []);
};

const ViewProjectCreation = connect(mapStateToProps, mapDispatchToProps)((props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialogPDF, setOpenDialogPDF] = useState(false)
  const [openDialogExcel, setOpenDialogExcel] = useState(false)
  const [countLoading, setCountLoading] = useState("")
  const [endExport, setEndExport] = useState("")
  // const [typeEditor, setTypeEditor] = useState('');

  const listArea = props.projectReducer.project.areas;
  const project = props.projectReducer.project;
  const listActivePage = props.projectReducer.listActivePageAreas;
  // if (props.projectReducer.project.typeEditor !== null) {
  // setTypeEditor(props.projectReducer.project.typeEditor);
  // }
  const typeEditor = props.projectReducer.typeEditor;
  const listIdChoosedMaterial = props.projectReducer.listIdChoosedMaterial;

  useUnload(() => {
    props.saveProjectLocalDispatch();
  })

  useEffect(() => {
    props.saveProjectFromLocal();
  }, [])
  console.log("text editor ", typeEditor);

  const writeFile = async () => {

    setOpenDialogExcel(true)
    try {
      fetch(window.location.origin + '/Phieu-thong-tin-vat-lieu.xlsx').then(async (res) => {

        const projectData = props.projectReducer.project;
        // let result = await callAPI('POST', '/project/export', { data: projectData })
        // console.log("result: ",result);
        // setIsLoading(false)
        // window.open(result.pathFileDownload)


        // console.log('====================================');
        // console.log("resultresultresultresult ", result);
        // console.log('====================================');

        var arrBuffer = await res.arrayBuffer()
        // console.log('====================================');
        // console.log("ressss ", await res.arrayBuffer());
        // console.log('====================================');

        // let file = new File(`${window.location.origin} '/Phieu-thong-tin-vat-lieu.xlsx'`, 'Phieu-thong-tin-vat-lieu.xlsx');
        // console.log("fileeeeeeeeeee ",file );

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "Xhome";
        let startRowTable = 8;
        setEndExport("Đang ghi dữ liệu...")
        await workbook.xlsx.load(arrBuffer).then(async (data) => {
          for (let indexArea = 0; indexArea < projectData.areas.length; indexArea++) {
            let area = projectData.areas[indexArea];
            for (let indexProd = 0; indexProd < area.listProduct.length; indexProd++) {
              let product = area.listProduct[indexProd];

              const worksheet = data.getWorksheet("Phieu_thong_tin");
              ////////////////////add image
              if (indexProd === 0) {
                let imageHeader = await fetch(window.location.origin + '/header.png')
                  .then(res => res.arrayBuffer())
                let idImgHeader = data.addImage({
                  buffer: Buffer.from(imageHeader),
                  extension: 'png',
                })
                worksheet.addImage(idImgHeader, 'A1:H1');
              }

              let imageCat = await fetch(product.catalog_image)
                // let imageCat = await fetch("https://2.bp.blogspot.com/-0rtLokjcPmU/U4VgHC-OPYI/AAAAAAAAIYo/ocpxt5YXZG8/s1600/064ormejap.jpg")
                .then((res) => {
                  if (res.statusText === "Not Found") { return "no image" } else { return res.arrayBuffer() }
                })
              // console.log("imageCat: ", imageCat);
              var row = startRowTable - 0.2
              if (imageCat !== "no image") {
                let idImgCat = data.addImage({
                  buffer: Buffer.from(imageCat),
                  extension: 'png',
                })

                worksheet.addImage(idImgCat, {
                  tl: { col: 2.2, row },
                  ext: { width: 189.12, height: 290.88 }
                })
              }


              let imageProd = await fetch(product.image_url)
                // let imageProd = await fetch("https://2.bp.blogspot.com/-0rtLokjcPmU/U4VgHC-OPYI/AAAAAAAAIYo/ocpxt5YXZG8/s1600/064ormejap.jpg")
                .then((res) => {
                  if (res.statusText === "Not Found") { return "no image" } else { return res.arrayBuffer() }
                })
              // console.log("IMAGEPROD: ", imageProd);
              if (imageProd !== "no image") {
                let idImgProd = data.addImage({
                  buffer: Buffer.from(imageProd),
                  extension: 'png',
                })
                worksheet.addImage(idImgProd, {
                  tl: { col: 5.2, row },
                  ext: { width: 189.12, height: 290.88 }
                })
              }

              //   // a: khu vực, b: vật liệu, c: quyển - ảnh, d: mã sp, e: mô tả, f: hình ảnh - ảnh, g: kích thước, h: ghi chú
              if (indexArea === 0 && indexProd === 0) {
                worksheet.getColumn('A').width = 15
                worksheet.getColumn('B').width = 15
                worksheet.getColumn('C').width = 30
                worksheet.getColumn('D').width = 15
                worksheet.getColumn('E').width = 20
                worksheet.getColumn('F').width = 30
                worksheet.getColumn('G').width = 15
                worksheet.getColumn('H').width = 15
                worksheet.getRow("4").getCell("A").value += projectData.codeContract
                worksheet.getRow("5").getCell("A").value += projectData.customer
                // worksheet.getRow([startRowTable]).getCell("A").value = area.area;
                worksheet.getRow([startRowTable]).getCell("B").value = product.material;
                worksheet.getRow([startRowTable]).getCell("C").value = "";
                worksheet.getRow([startRowTable]).getCell("D").value = product.code;
                worksheet.getRow([startRowTable]).getCell("E").value = product.description ? product.description : "";
                worksheet.getRow([startRowTable]).getCell("F").value = "";
                worksheet.getRow([startRowTable]).getCell("G").value = product.size ? product.size : "";
                worksheet.getRow([startRowTable]).getCell("H").value = product.note ? product.note : "";
              } else {
                worksheet.insertRow(startRowTable, ["", product.material, "",
                  product.code, product.description ? product.description : "", "",
                  product.size ? product.size : "", product.note ? product.note : ""], "i+");

                if (indexProd === area.listProduct.length - 1) {
                  if (area.listProduct.length > 1) {
                    worksheet.mergeCells("A" + startRowTable + ":A" + (startRowTable - (area.listProduct.length - 1)))
                  }
                  worksheet.getRow([startRowTable]).getCell("A").value = area.area;
                }

              }

              if (indexArea === projectData.areas.length - 1 && indexProd === area.listProduct.length - 1) {
                worksheet.mergeCells('F' + (startRowTable + 2) + ':H' + (startRowTable + 2));
                worksheet.mergeCells('F' + (startRowTable + 3) + ':H' + (startRowTable + 3));

                const dateNow = new Date();
                const time = "TP.HCM, Ngày " + dateNow.getDate() + " tháng " + (dateNow.getMonth() + 1) + " năm " + dateNow.getFullYear();
                worksheet.getRow(`${startRowTable + 2}`).getCell("F").value = time;
                worksheet.getRow(`${startRowTable + 3}`).getCell("F").value = "PHÒNG THIẾT KẾ";
                worksheet.getRow(`${startRowTable + 2}`).getCell("F").alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getRow(`${startRowTable + 3}`).getCell("F").alignment = { vertical: 'middle', horizontal: 'center' };
                worksheet.getRow(`${startRowTable + 3}`).getCell("F").font = { bold: true };
              }


              startRowTable++;
              setCountLoading("Khu vực: " + (indexArea + 1) + "/" + projectData.areas.length + " - Vật liệu: " + (indexProd + 1) + "/" + area.listProduct.length);
            };
            // console.log("area: ", (indexArea + 1) + "/" + projectData.areas.length);
          };
        })
        setEndExport("Đang hoàn tất (còn khoảng 20s...)")
        arrBuffer = await workbook.xlsx.writeBuffer()

        // const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([arrBuffer], { type: 'application/vnd.ms-excel' });
        //isLoading false

        setOpenDialogExcel(false)
        saveAs(blob, "Phieu-thong-tin-vat-lieu.xlsx")
      })
    } catch (e) {
      console.error(e);
    }
  };
  const [exportPDF, setExportPDF] = useState(false);
  let listDisplayProduct = [];
  return (
    <Container maxWidth={false} className="project-creation-container">
      <div className="flex-between-center">
        <h1 className="title-project-creation">{project.id ? "Chỉnh sửa dự án" : props.pageTitle}</h1>
        <div className="block-action-header">
          {listArea.length > 0 ?
            <>
              <label className="block-btn-action">
                {
                  typeEditor !== 'trashCan'
                    ?
                    <>
                      <Button style={{ display: "none" }}>NONE</Button>
                      <Button variant="outlined" color="primary" className="btn-excel" onClick={() => writeFile()}>Excel</Button>
                      <Dialog
                        disableBackdropClick
                        open={openDialogExcel}
                        // onClose={() => setOpenDialogExcel(false)}
                        aria-labelledby="form-dialog-title"
                      >
                        {/* <DialogTitle id="form-dialog-title">Ghi chú sản phẩm</DialogTitle> */}
                        <DialogContent>
                          {endExport}
                          <hr />
                          <br />
                          {countLoading}
                        </DialogContent>
                        <br />
                      </Dialog>


                      <Button variant="outlined" className="btn-pdf" color="secondary" onClick={() => setOpenDialogPDF(true)}>PDF</Button>
                      <Dialog
                        open={openDialogPDF}
                        onClose={() => setOpenDialogPDF(false)}
                        aria-labelledby="form-dialog-title"
                      >
                        {/* <DialogTitle id="form-dialog-title">Ghi chú sản phẩm</DialogTitle> */}
                        <DialogContent>
                          {openDialogPDF &&
                            <BlobProvider key={Math.random()} document={<PDF data={props.projectReducer.project} />}>
                              {({ blob, url, loading, error }) => {
                                return loading ? <div>Đang tải dữ liệu....</div> : <Button variant="outlined" className="btn-pdf" color="secondary" onClick={() => window.open(url, '_blank')}>Xem trước</Button>
                              }}
                            </BlobProvider>
                          }
                        </DialogContent>
                        <br />
                      </Dialog>

                      <NavLink to={project.id ? "/dashboard/project-creation" : "/dashboard/"} >
                        <Button variant="outlined" color="primary" onClick={
                          () => {
                            if (project.codeContract === null || project.customer === null) {
                              alert("Vui Lòng Nhập Mã Dự Án Hoặc Tên Khách Hàng")
                            } else if (project.id) {
                              props.updateProject(project)
                            } else {
                              props.saveProject(project)
                            }
                          }
                        }>Lưu</Button>
                      </NavLink>
                      <Dialog
                        open={props.isLoadingSave}
                        aria-labelledby="form-dialog-title"
                      >
                        {/* <DialogTitle id="form-dialog-title">Ghi chú sản phẩm</DialogTitle> */}
                        <DialogContent>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <img width="20px" src="https://www.bluechipexterminating.com/wp-content/uploads/2020/02/loading-gif-png-5.gif" alt="loading" />
                          </div>
                          <div>Đang lưu</div>
                        </DialogContent>

                        <br />
                      </Dialog>
                    </>
                    :
                    <></>
                }

                <NavLink to={typeEditor !== 'trashCan' ? "/dashboard/" : "/dashboard/trashcan"} >
                  <Button
                    variant="contained"
                    color="secondary"
                    className="btn-cancel"
                    // href='/dashboard/' 
                    style={{ whiteSpace: "nowrap", color: '#fff' }}
                    onClick={() => {
                      props.saveProjectLocalDispatch()
                    }}
                  >
                    Quay Lại
                  </Button>
                </NavLink>
                {!project.id &&
                  <NavLink to="/dashboard/project-creation" style={{ margin: '0 2%' }}>
                    <Button variant="contained" color="secondary" className="btn-cancel" onClick={() => {
                      props.dropProject(project)
                      localStorage.removeItem("newProject")
                      localStorage.removeItem("typeSaveProject")
                      // setCodeContract('')
                      // setCustomer('')
                    }}>Hủy</Button>
                  </NavLink>
                }
              </label>
            </>
            :
            <>
              <label className="block-btn-action">
                <NavLink to="/dashboard">
                  <Button
                    variant="contained"
                    color="secondary"
                    className="btn-cancel"
                    // href='/dashboard' 
                    style={{ whiteSpace: "nowrap", color: '#fff' }}
                  >
                    Quay Lại
                  </Button>
                </NavLink>
              </label>
            </>
          }
        </div>
      </div>
      <Divider />
      <div className="main-project-creation">
        <EnterCodeAndCustomerName />
        <div className="block-card">
          {listArea.length > 0 ?
            listArea.map((item, key) => {
              let paginateButton = [];
              let totalProduct = item.listProduct.length;
              let limit = 1;
              let totalPage = Math.ceil(totalProduct / limit);
              var activePage = null
              var beginPoint = null
              var endPoint = null
              let listDisplayProduct = []
              for (let a = 1; a <= totalPage; a++) {
                activePage = listActivePage[key];
                beginPoint = (activePage - 1) * limit;
                endPoint = beginPoint + limit;
                if (a == activePage) { listDisplayProduct = (item.listProduct.slice(beginPoint, endPoint)) }
                paginateButton.push(1);
              }

              const displayProduct = { beginPoint, listDisplayProduct, activePage, paginateButton }
              return (
                <CardArea
                  {...props}
                  area={item}
                  index={key}
                  key={key}
                  displayProduct={displayProduct}
                  listProduct={item.listProduct}
                  totalPage={totalPage}
                  listArea={listArea}
                  listIdChoosedMaterial={listIdChoosedMaterial}
                />
              )
              // (item)
            })
            :
            null
          }
        </div>
      </div>
      <div>
      </div>
    </Container >

  )
})



