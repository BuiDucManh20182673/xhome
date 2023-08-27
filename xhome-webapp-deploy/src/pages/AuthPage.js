// import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "../styles/scss/login-page.scss";
import whiteLogo from "../styles/images/white-logo.png";
import logo from "../styles/images/logo-xhome.png";
import loadImg from "../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import bottomShape from "../styles/images/bottom-shape.png";
import topShape from "../styles/images/top-shape.png";
import { Button, Dialog, DialogActions, DialogTitle, Divider, TextField, DialogContent } from "@material-ui/core"
import { useAuth } from "../App";
import Icon from '@mdi/react'
import { mdiAccount, mdiLock, mdiChevronDown } from '@mdi/js';
import loginAPI from "../api/login";
import { UN, PW } from "../constants/callAPI"
import {
	useHistory,
	useLocation
} from "react-router-dom";
import { saveTokenToStorage } from "../constants/keyManager";
import { connect } from "react-redux";
import { forgetUserPassword } from "../constants/actionCreators"

const AuthPage = connect(null, (dispatch) => {
	return {
		changeAccountPassword: (account) => {
			dispatch(forgetUserPassword(account))
		}
	}
})((props) => {
	const [username, updateUsername] = useState();
	const [password, updatePassword] = useState();
	const [buttonStatus, enableButton] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [checkShiangMK, setCheckShiangMK] = useState(localStorage.getItem("checkShiangMK") ? true : false)
	const [openDialog, setOpenDialog] = useState(false);
	const [accountChange, setAccountChange] = useState('');
	const [scrollOpenForm, setScrollOpenForm] = useState(false);
	const [lastScrollTop, setLastScrollTop] = useState(0);
	const windowScreen = window.innerWidth <= 768;
	useEffect(() => {
		enableButton(username && password);
	}, [username, password]);
	let history = useHistory();
	let location = useLocation();
	let auth = useAuth();
	let login = async () => {
		setIsLoading(true)
		const res = await loginAPI({ username, password })
		if (res.err) {
			if (res.err === "Non existed user") {
				alert("Tài khoản không tồn tại!")
			} else if (res.err === "Wrong password") {
				alert("Sai mật khẩu!")
			} else {
				alert("lỗi server!!")
				console.log(res)
			}
			setIsLoading(false)
		} else {
			// if (localStorage.getItem("checkShiangMK")) {
			// 	localStorage.setItem(UN, username);
			// 	localStorage.setItem(PW, password);
			// } else {
			// 	sessionStorage.setItem(UN, username);
			// 	sessionStorage.setItem(PW, password);
			// }

			localStorage.setItem("UI", JSON.stringify(res))
			let { from } = location.state || { from: { pathname: "/" } };
			auth.signin(() => {
				history.replace(from);
				setIsLoading(false)
			});
		}
	};
	if (window.innerWidth > 768) {
		const heightScreen = window.innerHeight;
		var flag = true
		const scrollTop = scrollOpenForm
			?
			setTimeout(() => {
				window.scrollTo({ top: heightScreen, behavior: 'smooth' });
			}, 800)
			:
			setTimeout(() => {
				window.scrollTo({ top: 0, behavior: 'smooth' })
			}, 300);

		const handleScroll = () => {
			const windowPosition = Math.ceil(window.pageYOffset) ;
			console.log(windowPosition, heightScreen, flag);
			if (windowPosition == 0) {
				flag = true
			}
			if (windowPosition >= heightScreen) {
				flag = false
			}
			if (windowPosition > 0 && flag == true) {
				setScrollOpenForm(true);
			}
			if (windowPosition < heightScreen && flag == false) {
				setScrollOpenForm(false);
			}
		}
		useEffect(() => window.addEventListener("scroll", handleScroll), []);
	}

	return (
		<div>
			{isLoading ?
				<div style={{ display: "flex", justifyContent: "center" }}>
					<img width="20%" src={loadImg} />
				</div>
				:
				<div className="login-page-container">
					{/* overlay is here */}
					{windowScreen ?
						<div className='middle-background'></div>
						:
						scrollOpenForm ?
							<div className='scroll-middle-background'></div>
							:
							null
					}
					{/* form login is here */}
					<div>
						<div className={windowScreen ? "overlay-background" : scrollOpenForm ? "overlay-background scroll-background" : "overlay-background"}>
							<div className="logo">
								<img src={windowScreen ? whiteLogo : logo} alt="xhome-logo" />
								<p className="title">Sign in to start your work</p>
							</div>
							<div className="login-form">
								<div style={{ position: 'relative' }}>
									<Icon path={mdiAccount} size={1} className="icon-login" />
									<input
										type="text"
										placeholder="Tên đăng nhập"
										onChange={(e) => updateUsername(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												login();
											}
										}}
									/>
								</div>
								<div style={{ position: 'relative' }}>
									<Icon path={mdiLock} size={1} className="icon-login" />
									<input
										type="password"
										placeholder="Mật khẩu"
										onChange={(e) => updatePassword(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												login();
											}
										}}
									/>
								</div>
								<div className="forget-password" onClick={() => setOpenDialog(true)}>Forgot your password?</div>
								<Dialog
									open={openDialog}
									aria-labelledby="form-dialog-title"
									fullWidth={true}
									maxWidth={'xs'}
								>
									<DialogTitle>Nhập tên tài khoản</DialogTitle>
									{/* <Divider /> */}
									<DialogContent>
										<TextField
											fullWidth
											id="outlined-basic"
											label="Tài khoản"
											variant="outlined"
											color="primary"
											style-
											onChange={(e) => setAccountChange(e.target.value)}
										/>
									</DialogContent>
									<DialogActions>
										<Button
											onClick={() => {
												if (accountChange === '') {
													alert('Bạn cần nhập tên tài khoản')
												} else {
													props.changeAccountPassword(accountChange)
												}
											}}
											color="primary"
											variant="contained"
										>Reset</Button>
										<Button
											onClick={() => {
												setOpenDialog(false);
												setAccountChange('');
											}}
											color="secondary"
											variant="contained"
										>Hủy</Button>
									</DialogActions>
								</Dialog>
								<div>
									<button
										onClick={() => {
											// saveTokenToStorage("TEST");
											login();
										}}
										disabled={!buttonStatus}
									>
										Đăng nhập
						</button>
								</div>
								{/* <div className="wrap-rmb-inp">
						<input type="checkbox" name="" id="rmb-pwd-inp" value={checkShiangMK}
							onChange={(e) => {
								!checkShiangMK ? localStorage.setItem("checkShiangMK", true) : localStorage.removeItem("checkShiangMK")
								setCheckShiangMK(!checkShiangMK)
							}}
						/>
						<label htmlFor="rmb-pwd-inp">Nhớ mật khẩu</label>
					</div> */}
							</div>
						</div>
						{windowScreen ?
							null
							:
							<div>
								<div className="introduce-title">
									<h2>Welcome to Xhome</h2>
									<p>We are the best</p>
								</div>
								<div className={scrollOpenForm ? "introduce-description open" : "introduce-description"}>
									Hello, Friend!
								</div>
								<div className="scroll-down-btn" onClick={() => setScrollOpenForm(true)}>
									<Icon path={mdiChevronDown} size={2} />
								</div>
								<div className={scrollOpenForm ? "scroll-up-btn open" : "scroll-up-btn"} onClick={() => setScrollOpenForm(false)}>
									<Icon path={mdiChevronDown} size={2} />
								</div>
							</div>
						}
					</div>
				</div>
			}
		</div>
	);
});

export default AuthPage;
