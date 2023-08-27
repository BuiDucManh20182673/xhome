import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import callAPI from "../../api/callAPI";
import { Divider } from "@material-ui/core";
import ExcelJS from "exceljs";
import { DialogAddNewProduct } from "../_Common/ModalProduct";
import uploadImages from "../../api/uploadMultiImage"
import { DOMAIN_IMAGE } from "../../constants/callAPI"
import ExcelHandler from "./excelHandler";
import { Dialog, DialogContent } from '@material-ui/core';
import loadImg from "../../styles/images/ecd6bc09da634e4e2efa16b571618a22.gif"
import { saveAs } from "file-saver";
import PaginationComponent from '../_Common/PaginationComponent'
import SearchComponent from '../_Common/SearchComponent'
import { CopyToClipboard } from "react-copy-to-clipboard"
const Importing = ({ pageTitle }) => {
	const [openDialog, setOpenDialog] = useState(false);
	const [errorDescription, setErrorText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingUM, setIsLoadingUM] = useState(false)
	const [isOpenModalResultUpload, setIsOpenModalResultUpload] = useState(false)
	const [listFile, setListFile] = useState([])
	const [listFileDB, setListFileDB] = useState([])
	const [totalPage, setTotalPage] = useState(10)
	const [activePage, setActivePage] = useState(1)
	const [textSearch, setTextSearch] = useState("")
	const [stateValueImgUrl, setStateValueImgUrl] = useState([])
	const [copied, setCopied] = useState(false)
	const [isCopied, setIsCopied] = useState(false)
	// const [writenFile, setWritenFile] = useState(0)
	// const [totalFile, setTotalFile] = useState(0)
	const callAPIImg = async (page, textSearch) => {
		let url = `/image/images-m?page=${page}&limit=20`;
		if (textSearch) {
			url = `/image/images-m/search?page=${page}&limit=20&textSearch=${textSearch}`
		}
		const res = await callAPI("GET", url)
		setListFileDB(res.data);
		setTotalPage(res.totalPage);
	}
	useEffect(() => {
		callAPIImg(1);
	}, [])
	const handleImport = async (files) => {
		setIsLoading(true)
		if (files.length === 0) return;
		const handler = new ExcelHandler();
		handler.setFiles(files);

		if (handler.files.length === 0) {
			setIsLoading(false)
			return setErrorText(
				"Vui lòng chọn tập tin hợp lệ (tham khảo điều 1 phần lưu ý)."
			);
		}
		await handler.readFile();
		const res = await callAPI("POST", "/product/import", handler.materials);
		if (!res.err) {
			return setIsLoading(false)
		}
		// Handle error
		const { details } = res.err;
		if (details) {
			setIsLoading(false)
			const errorKeys = details.map((item) => { console.log(item) });
			const paths = details
				.map(item => item.path.length ? item.path[0] : "")
				.reduce((prev, curr) => prev.concat(curr), [])
			if (errorKeys.includes("imageUrl"))
				setErrorText("Ảnh không đúng định dạng (tham khảo điều 4 phần lưu ý).")
			else if (paths.includes("name"))
				setErrorText("Cột vật liệu có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("fraction"))
				setErrorText("Cột phân khúc có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("supplier"))
				setErrorText("Cột nhà cung cấp hoặc nhà phân phối có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("catalog"))
				setErrorText("Cột tên quyển có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("product"))
				setErrorText("Cột sản phẩm có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("group"))
				setErrorText("Cột loại có trường để trống (tham khảo điều 5 phần lưu ý).")
			else if (paths.includes("miniProduct"))
				setErrorText("Cột mã sản phẩm có trường để trống (tham khảo điều 5 phần lưu ý).")
			else
				setErrorText("Lỗi không xác định !!!")
		}
	};

	const handleUploadImage = async (event) => {
		const imageFiles = Array.from(event.target.files);
		// setTotalFile(imageFiles.length)
		let photos = [];
		imageFiles.every(async (imageFile, idx) => {
			if (!imageFile) {
				setIsLoadingUM(false)
				alert('Vui lòng chọn ảnh!')
				return false;
			}
			if (!imageFile.name.match(/.+\.(gif|png|jpe?g)$/i)) {
				setIsLoadingUM(false)
				alert('Định dạng ảnh không hỗ trợ! File gặp vấn đề: ' + imageFile.name)
				return false;
			}
			photos.push(imageFile)
			if (idx === imageFiles.length - 1) {
				setIsLoadingUM(true);
				const res = await uploadImages(photos)
				if (res.err && res.err !== "jwt expired" && res.err !== "Permission denied !!!") {
					if (res.err === "File too large") {
						alert("File ảnh quá lớn!")
					} else {
						alert("Đã xảy ra lỗi khi thêm ảnh!")
					}
					console.log(res)
					setIsLoadingUM(false)
				} else {
					const { fileNames } = res
					callAPIImg(totalPage)
					setListFile(fileNames)
					setIsLoadingUM(false)
					setIsOpenModalResultUpload(true)
					// const workbook = new ExcelJS.Workbook();
					// workbook.addWorksheet("Danh sách link ảnh")
					// var buffer = await workbook.xlsx.writeBuffer();
					// fileNames.forEach(async (element, indx) => {
					// 	await workbook.xlsx.load(buffer).then(async (data) => {
					// 		const worksheet = data.getWorksheet("Danh sách link ảnh");
					// 		if (indx === 0) {
					// 			worksheet.getColumn('A').width = 18
					// 			worksheet.getColumn('B').width = 50
					// 		}
					// 		worksheet.getRow(indx + 1).height = 100
					// 		worksheet.getRow(indx + 1).alignment = { vertical: 'middle', horizontal: 'center' };

					// 		let image = await fetch(DOMAIN_IMAGE + element)
					// 			.then(res => res.arrayBuffer())
					// 		let idImage = workbook.addImage({
					// 			buffer: Buffer.from(image),
					// 			extension: 'png',
					// 		})
					// 		worksheet.addImage(idImage, {
					// 			tl: { col: 0.2, row: indx },
					// 			ext: { width: 100, height: 100 }
					// 		});
					// 		worksheet.getRow([indx + 1]).getCell("B").value = DOMAIN_IMAGE + element;
					// 		buffer = await workbook.xlsx.writeBuffer();
					// 		// setWritenFile(indx + 1)
					// 	})
					// 	if (indx === fileNames.length - 1) {
					// 		const blob = new Blob([buffer], { type: 'application/vnd.ms-excel' });
					// 		setIsLoadingUM(false)
					// 		saveAs(blob, "image_links.xlsx")
					// 	}
					// });
				}
			}
		});
		// const res = await uploadImage(imageFile)
		// if (res.err) {
		// 	alert("Đã xảy ra lỗi khi thêm ảnh!")
		// } 
		// else {
		// 	setImageUrl(DOMAIN_IMAGE + res.fileName)
		// }
	}
	const onCopy = () => {
		setCopied(true);
	}

	function openDialogCopy() {
		setCopied(true);
		setTimeout(() => {
			setCopied(false)
		}, 500);
	}
	return (
		<div className="container">
			<h1>{pageTitle}</h1>
			<Divider />
			<br />
			<b>** Lưu ý import excel:</b>
			<ol>
				<li>Người dùng có thể chọn nhiều file excel.</li>
				<li>Tập tin đưa vào là tập tin excel có đuôi .xlsx.</li>
				<li>
					Tập tin có thể có nhiều sheet. Mỗi sheet cần có đủ các cột vật liệu,
					phân khúc, nhà cung cấp, nhà phân phối, sản phẩm, loại, tên quyển,
					quyển, mã sản phẩm, hình ảnh.
				</li>
				<li>
					Cột hình ảnh và quyển có thể để trống, nếu đưa vào thì bắt buộc đưa
					vào url ảnh.
				</li>
				<li>
					Ngoại trừ 2 cột hình ảnh và quyển, các cột khác nếu hàng có dữ liệu,
					buộc phải có giá trị (tức không được để trống).
				</li>
				<li>
					Tên cột có thể viết hoa hoặc viết thường, bắt buộc tên phải giống và không viết liền các chữ như sau:
					"vật liệu",
					"phân khúc",
					"nhà cung cấp",
					"nhà phân phối",
					"sản phẩm",
					"loại",
					"tên quyển",
					"quyển",
					"mã sản phẩm",
					"hình ảnh"
				</li>
			</ol>
			<Button
				variant="contained"
				component="label"
				style={window.innerWidth <= 393 ? { fontSize: '13' } : { fontSize: '0.875rem' }}
				onClick={() => setErrorText("")}
			>
				Chọn file Excel để Import
				<input
					multiple
					type="file"
					style={styles.hiddenElement}
					onChange={(e) => {
						handleImport(e.target.files);
						e.target.value = "";
					}}
				/>
			</Button>

			<Button
				style={window.innerWidth <= 415 ? { margin: '10px 0px ' } : { marginLeft: 40 }}
				// style={styles.manuallyImport}
				variant="contained"
				component="label"
				onClick={() => {
					setErrorText("");
					setOpenDialog(true);
				}}
			>
				Import Thủ Công
			</Button>

			<div>
				<p><b>** Lưu ý upload ảnh:</b> <span> Nếu muốn upload nhiều ảnh thì giữ phím <b>ctrl + chuột trái</b> để chọn nhiều ảnh!</span></p>

				<Button
					style={window.innerWidth <= 415 ? { margin: '10px 0px ' } : { marginLeft: 0 }}
					// style={styles.manuallyImport}
					variant="contained"
					component="label"
				>
					Upload Ảnh
					<input
						type="file"
						multiple
						onChange={handleUploadImage}
						hidden
						onClick={(e) => e.target.value = ""}
					/>
				</Button>
				<Dialog open={isLoadingUM}>
					{/* <p>{writenFile}/{totalFile}</p> */}
					<br />
					<div style={{ display: "flex", justifyContent: "center" }} >
						<img
							style={window.innerWidth <= 500
								?
								{ width: "100%", height: "60%" }
								:
								{ width: "30%" }}
							src={"https://cdn.shopify.com/s/files/1/2303/7301/files/Uploading-GIF2.gif?18840"} alt="loading image" />
					</div>
					<br />
				</Dialog>
				<Dialog open={copied}>
					{/* <p>{writenFile}/{totalFile}</p> */}
					<br />
					<div style={{ width: 90, height: 30, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }} >
						Đã Copy
					</div>
					<br />
				</Dialog>
				<br />
				<br />
				<Dialog fullWidth maxWidth="lg" open={isOpenModalResultUpload} onClose={() => setIsOpenModalResultUpload(false)}>
					<table style={{ width: "100%" }}>
						{listFile.map((item, idx) => (
							<tr style={{ border: "1px solid black", textAlign: "center" }}>
								<td style={{ border: "1px solid black" }}>Ảnh số {idx + 1}:</td>
								<td style={{ border: "1px solid black" }}><img width="100px" height="100px" src={DOMAIN_IMAGE + item} /></td>
								<td style={{ border: "1px solid black" }}>
									{/* {DOMAIN_IMAGE + item} */}
									<input value={DOMAIN_IMAGE + item} size={10}
										disabled
										style={{
											width: "70%",
											marginRight: 10
										}} />

									<CopyToClipboard text={DOMAIN_IMAGE + item} onCopy={onCopy}>
										<button onClick={() => { openDialogCopy() }}>Copy</button>
									</CopyToClipboard>
									{/* <button onClick={() => {
									navigator.clipboard.writeText(DOMAIN_IMAGE + item)
								}}>copy</button> */}
								</td>
							</tr>
						))}
					</table>
				</Dialog>
				<h2>Bảng Quản Lý Ảnh</h2>
				<SearchComponent search={(data) => {
					setActivePage(1)
					setTextSearch(data.textSearch)
					callAPIImg(1, data.textSearch)
				}} />
				<br />
				<table style={{ width: "100%" }}>
					{listFileDB.map((item, idx) => {
						const firstString = item.imgUrl.substring(0, item.imgUrl.lastIndexOf("/") + 1)
						const middleString = item.imgUrl.substring(item.imgUrl.lastIndexOf("/") + 1, item.imgUrl.lastIndexOf("."))
						const lastString = item.imgUrl.substring(item.imgUrl.lastIndexOf("."), item.imgUrl.lastIndexOf(".") + 4)
						return (
							<>
								<tr className="tr-custom" style={{ textAlign: "center", height: '100px', marginTop: 8 }}>
									<td >
										<div style={{ border: "1px solid gray", height: '100px', width: '100px', margin: 'auto' }}>
											<img width="100%" height="100px" src={item.imgUrl} />
										</div>
									</td>
									<td >
										{/* {DOMAIN_IMAGE + item} */}
										<div style={{
											// border: "1px solid black",
											maxWidth: '92%',
											height: '100px',
											display: 'flex',
											alignItems: 'center',
											// justifyContent: 'center',
											flexWrap: 'wrap',
											// margin: 'auto'
										}}>
											<span style={{ marginLeft: 10 }}>
												{firstString}
											</span>
											<input
												value={(stateValueImgUrl[idx] !== "" && stateValueImgUrl[idx]) ? stateValueImgUrl[idx] : middleString} size={10}
												style={{
													width: window.innerWidth < 400 ? "265px" : "400px",
													textOverflow: "ellipsis",
													margin: "0px 10px"
												}}
												onChange={(e) => {
													const valueImgArr = [...stateValueImgUrl]
													valueImgArr[idx] = e.target.value
													// e.target.style.width = ((e.target.value.length + 1) * 8) + 'px';
													setStateValueImgUrl(valueImgArr)
												}}
												onKeyPress={async (e) => {
													if (e.key === "Enter") {
														await callAPI("PUT", "/image/images-m", {
															id: item.id,
															newImgUrl: e.target.value,
															oldImgUrl: middleString
														})
														setStateValueImgUrl([])
														await callAPIImg(activePage, textSearch === "" ? null : textSearch)
													}
												}}
											/>
											<span style={{ margin: "0 10px" }}>
												{lastString}
											</span>
											<CopyToClipboard text={item.imgUrl} onCopy={onCopy}>
												<button
													style={{ maxWidth: '200px', margin: 'auto 10px' }}
													onClick={() => { openDialogCopy() }}
												>Copy</button>
											</CopyToClipboard>
											{/* <Dialog open={isCopied}>
												Đã copy
											</Dialog> */}
											{/* <button onClick={() => {
									navigator.clipboard.writeText(DOMAIN_IMAGE + item)
								}}>copy</button> */}
										</div>
									</td>
								</tr>
								{window.innerWidth < 400 && <hr />}

							</>
						)
					})}
				</table>
				<PaginationComponent
					activePage={activePage}
					totalPage={totalPage}
					onPaginate={(pageIdx) => {
						setActivePage(pageIdx)
						callAPIImg(pageIdx, textSearch === "" ? null : textSearch)
					}}
				/>
			</div>
			<DialogAddNewProduct
				open={openDialog}
				type="add"
				handleClose={() => setOpenDialog(false)}
			/>
			<Dialog open={isLoading}>
				<br />
				<div style={{ display: "flex", justifyContent: "center" }} >
					<img width="30%" src={"https://cdn.shopify.com/s/files/1/2303/7301/files/Uploading-GIF2.gif?18840"} alt="loading image" />
				</div>
				{/* <DialogContent style={{ display: "flex", justifyContent: "center" }}>
					Đang nhập dữ liệu
				</DialogContent> */}
				<br />
			</Dialog>

			<div style={styles.errorText}>{errorDescription}</div>
		</div>
	);
};

const styles = {
	hiddenElement: {
		display: "none",
	},
	manuallyImport: {
		marginLeft: 40,
	},
	errorText: {
		fontWeight: "bold",
		color: "red",
		marginTop: 10,
	},
};

export default Importing;
