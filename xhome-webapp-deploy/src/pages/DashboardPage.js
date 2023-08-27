import { useState, useEffect } from "react";
import { Switch, Link, NavLink, Route, useRouteMatch } from "react-router-dom";
import "../styles/scss/dashboard.scss";
import AccountSection from "../components/AccountSection";
import CatalogSection from "../components/CatalogSection";
import TypeAndSegment from "../components/TypeAndSegmentSection"
import DistributorSection from "../components/DistributorSection";
import ImportingSection from "../components/ImportingSection";
import TrashCanSection from "../components/TrashCanSection";
import MaterialSection from "../components/MaterialSection";
import ProjectCreationSection from "../components/ProjectCreationSection";
import ProjectSection from "../components/ProjectSection";
import SupplierSection from "../components/SupplierSection";
import ListPendingSection from "../components/ListPendingSection"
import { connect } from "react-redux"
// import testSubModalMaterial from "../components/_Common/testSubModal"
import { TextField, Typography, } from '@material-ui/core';
import logo from "../styles/images/logo-xhome.png";
// import logoMaterial from "../styles/images/icon/widgets-outline.png";
import {
  mdiFolderHomeOutline, mdiWidgetsOutline, mdiAccountCircleOutline, mdiAccountClockOutline, mdiBookOutline
  , mdiDatabaseImportOutline, mdiLogout, mdiAccount, mdiSegment, mdiHomeGroup, mdiClipboardTextMultipleOutline, mdiBookOpenPageVariantOutline,
  mdiTrashCanOutline
} from '@mdi/js';
import Icon from "@mdi/react";
import { mdiMenu, mdiTuneVariant, mdiMagnify } from "@mdi/js";
import noAvatar from "../styles/images/no-avatar.png"
const withContentContainer = (Component) => (props) => (
  <div className="content-container">
    <Component {...props} />
  </div>
);
const dashboardRoutesAdmin = [
  {
    subPath: "project-creation",
    name: "Khởi tạo dự án",
    component: withContentContainer(ProjectCreationSection),
  },
  {
    isExact: true,
    name: "Dự án",
    component: withContentContainer(ProjectSection),
  },
  {
    subPath: "material",
    name: "Vật liệu",
    component: withContentContainer(MaterialSection),
  },
  {
    subPath: "supplier",
    name: "Nhà phân phối",
    component: withContentContainer(SupplierSection),
  },
  // {
  //   subPath: "distributor",
  //   name: "Nhà phân phối",
  //   component: withContentContainer(DistributorSection),
  // },
  // {
  //   subPath: "type&segment",
  //   name: "Phân khúc",
  //   component: withContentContainer(TypeAndSegment),
  // },
  {
    subPath: "catalog",
    name: "Quyển",
    component: withContentContainer(CatalogSection),
  },
  {
    subPath: "account",
    name: "Tài khoản",
    component: withContentContainer(AccountSection),
  },
  {
    subPath: "pending",
    name: "Danh sách chờ duyệt",
    component: withContentContainer(ListPendingSection),
  },
  {
    subPath: "import",
    name: "Nhập dữ liệu",
    component: withContentContainer(ImportingSection),
  },
  {
    subPath: "trashcan",
    name: "Thùng rác",
    component: withContentContainer(TrashCanSection),
  },
  // {
  //   subPath: "demo",
  //   name: "Demo",
  //   component: withContentContainer(testSubModalMaterial)
  // }
]
const dashboardRoutesNormal = [
  {
    subPath: "project-creation",
    name: "Khởi tạo dự án",
    component: withContentContainer(ProjectCreationSection),
  },
  {
    isExact: true,
    name: "Dự án",
    component: withContentContainer(ProjectSection),
  },
  {
    subPath: "material",
    name: "Vật liệu",
    component: withContentContainer(MaterialSection),
  },
  {
    subPath: "supplier",
    name: "Nhà phân phối",
    component: withContentContainer(SupplierSection),
  },
  // {
  //   subPath: "distributor",
  //   name: "Nhà phân phối",
  //   component: withContentContainer(DistributorSection),
  // },
  // {
  //   subPath: "type&segment",
  //   name: "Phân khúc",
  //   component: withContentContainer(TypeAndSegment),
  // },
  {
    subPath: "catalog",
    name: "Quyển",
    component: withContentContainer(CatalogSection),
  },
  {
    subPath: "account",
    name: "Tài khoản",
    component: withContentContainer(AccountSection),
  },
  {
    subPath: "pending",
    name: "Danh sách chờ duyệt",
    component: withContentContainer(ListPendingSection),
  },
  // {
  //   subPath: "import",
  //   name: "Nhập dữ liệu",
  //   component: withContentContainer(ImportingSection),
  // },
  // {
  //   subPath: "demo",
  //   name: "Demo",
  //   component: withContentContainer(testSubModalMaterial)
  // }
];

const getMobileSideBarCSSClasses = (status) => {
  return `side-bar-container${status ? " open" : ""}`;
};

const DashboardPage = (props) => {
  const { path } = useRouteMatch();
  const [showNavBar, setNavBarStatus] = useState(false);
  const [dashboardRoutes, setDashboardRoutes] = useState(JSON.parse(localStorage.getItem('UI')).isAdmin ? dashboardRoutesAdmin : dashboardRoutesNormal);
  useEffect(() => {
    let body = document.getElementById("root")
    if (!showNavBar) {
      body.style.overflow = 'auto'
    } else {
      body.style.overflow = 'hidden'
    }
  }, [showNavBar])

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('UI')) !== null) {
      if (JSON.parse(localStorage.getItem('UI')).isAdmin) {
        setDashboardRoutes(dashboardRoutesAdmin)
      } else {
        setDashboardRoutes(dashboardRoutesNormal)
      }
    }
  }, [localStorage.getItem('UI')])

  return (
    <div className="dashboard-container">
      <div className={getMobileSideBarCSSClasses(showNavBar)}>
        <Link className="logo" to={`${path}`} onClick={() => {
          setNavBarStatus(false)
        }}  >
          <img alt="xhome-logo" src={logo} />
        </Link>
        <div className="info-account">
          <div className="info-account-img" >
            <img src={noAvatar} />
          </div>
          <div className="info-account-info">
            <p className="name-account">{localStorage.getItem("UI") ? JSON.parse(localStorage.getItem("UI")).fullName : ""}</p>
            <a href="/" onClick={() => localStorage.removeItem("UI")}>Đăng Xuất</a>
            {/* <Typography className="access-account">Admin</Typography> */}
            {/* <Typography className="phone-account">0973446447</Typography> */}
          </div>
        </div>
        <a
          className="nav-link fullname"
          // href="/"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span id='iconLogo'>
            <Icon path={mdiAccount} size={1} />
          </span>
          <div>
            {localStorage.getItem("UI") ? JSON.parse(localStorage.getItem("UI")).fullName : ""}
          </div>
        </a>
        {dashboardRoutes.map((route, idx) => {
          let iconMenu
          let showNav = false
          switch (route.name) {
            case "Dự án": //viewProject !== 0 && isAdmin
              iconMenu = mdiClipboardTextMultipleOutline
              if(JSON.parse(localStorage.getItem('UI')).viewProject !== 0 || JSON.parse(localStorage.getItem('UI')).isAdmin === 1){
                showNav = true
              }
              break;
            case "Vật liệu": //viewMaterial !== 0 && isAdmin
              iconMenu = mdiWidgetsOutline;
              if(JSON.parse(localStorage.getItem('UI')).viewMaterial !== 0 || JSON.parse(localStorage.getItem('UI')).isAdmin === 1){
                showNav = true
              }
              break;
            case "Nhà phân phối": //viewAgency !== 0 && isAdmin
              iconMenu = mdiHomeGroup;
              if(JSON.parse(localStorage.getItem('UI')).viewAgency !== 0 || JSON.parse(localStorage.getItem('UI')).isAdmin === 1){
                showNav = true
              }
              break;
            case "Phân khúc": //viewFraction !== 0 && isAdmin
              iconMenu = mdiSegment;
              if(JSON.parse(localStorage.getItem('UI')).viewFraction !== 0 || JSON.parse(localStorage.getItem('UI')).isAdmin === 1){
                showNav = true
              }
              break;
            case "Quyển": //viewCatalog !== 0 && isAdmin
              iconMenu = mdiBookOpenPageVariantOutline;
              if(JSON.parse(localStorage.getItem('UI')).viewCatalog !== 0 || JSON.parse(localStorage.getItem('UI')).isAdmin === 1){
                showNav = true
              }
              break;
            case "Tài khoản":
              iconMenu = mdiAccountCircleOutline;
              showNav = true;
              break;
            case "Danh sách chờ duyệt":
              iconMenu = mdiAccountClockOutline;
              showNav = true;
              break;
            case "Nhập dữ liệu": //admin
              iconMenu = mdiDatabaseImportOutline;
              showNav = true;
              break;
            case "Thùng rác": //admin
              iconMenu = mdiTrashCanOutline;
              showNav = true;
              break;
            default:
              break;
          }
          if (showNav) {
            return (
              // route.name !== "Khởi tạo dự án" &&
              <NavLink
                key={idx}
                className="nav-link"
                exact={route.isExact}
                to={`${path}/${route.subPath || ""}`}
                onClick={() => {
                  setNavBarStatus(false)
                  props.saveProjectLocalDispatch()
                }}
                style={route.name == "Khởi tạo dự án" ? { display: "none" } : { display: 'flex', alignItems: 'center' }}
              >
                <span id='iconLogo'>
                  <Icon path={iconMenu} size={1} />
                </span>
                {route.name}
              </NavLink>
            )
          }
        })}
        <a
          className="nav-link logout"
          href="/"
          onClick={() => localStorage.removeItem("UI")}
          style={{ display: 'flex', alignItems: 'center' }}

        >
          <span id='iconLogo'>
            <Icon path={mdiLogout} size={1} />
          </span>
          <div>Đăng Xuất</div>
        </a>
      </div>
      <div
        className="side-bar-mobile-mask"
        onClick={() => {
          setNavBarStatus(false)
        }}
      ></div>

      <div className="nav-movile-header">
        <button
          className="toggle-drawer-btn"
          onClick={() => {
            setNavBarStatus(true)
          }}
        >
          <Icon
            path={mdiMenu}
            size={1.5}
            color="white"
          />
        </button>
        <Link className="logo-head" to={`${path}`} onClick={() => {
          setNavBarStatus(false)
        }}  >
          <img alt="xhome-logo" src={logo} />
        </Link>
        {/* <TextField
          className="input-search"
          variant="outlined"
          size="small"
          placeholder="Tìm kiếm..."
          InputProps={{
            endAdornment: <Icon path={mdiMagnify} size={0.8} />
          }}
        />
        <button
        >
          <Icon
            path={mdiTuneVariant}
            size={1.3}
            color="white"
          />
        </button> */}
      </div>
      <Switch>
        {dashboardRoutes.map((route, idx) => (
          <Route
            key={`route-${idx}`}
            exact={route.isExact}
            path={`${path}/${route.subPath || ""}`}
            children={<route.component
              pageTitle={
                route.name === "Tài khoản"
                  ?
                  route.name + ": " + (
                    localStorage.getItem("UI")
                      ? JSON.parse(localStorage.getItem("UI")).fullName
                      : "")
                  :
                  route.name} />}
          />
        ))}
      </Switch>
    </div >
  );
};


export default connect(null, (dispatch) => ({
  saveProjectLocalDispatch: () => {
    dispatch({
      type: "SAVE_PROJECT_TO_LOCAL"
    })
  }
}))(DashboardPage);
