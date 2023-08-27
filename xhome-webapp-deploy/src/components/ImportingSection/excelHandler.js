import ExcelJS from "exceljs";

const VALID_EXCEL_EXTENSION = "xlsx";

export default class ExcelHandler {
	constructor() {
		this.files = [];
		this.activeFileIdx = null;
		this.activeWorksheet = null;
		this.materialColumns = [
			{ name: "vật liệu" },
			{ name: "phân khúc" },
			{ name: "nhà cung cấp" },
			{ name: "nhà phân phối" },
			{ name: "sản phẩm" },
			{ name: "loại" },
			{ name: "tên quyển" },
			{ name: "quyển" },
			{ name: "mã sản phẩm" },
			{ name: "hình ảnh" },
		];
		this.materials = null;
	}

	isString(s) {
		return typeof s === "string" || s instanceof String;
	}

	getSafeString = (s) =>
		s && Array.isArray(s.richText)
			? s.richText.map((textObj) => textObj.text).join(" ")
			: s || "";

	getSafeDistributor = (s) => {
		try {
			const rawStr = this.getSafeString(s);
			const rawStrArr = rawStr.split("\n");
			const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
			return {
				name: rawStrArr.shift(),
				email: rawStr.match(emailRegex)[0],
				tel: rawStrArr.pop(),
			};
		} catch {
			return {
				name: "",
				email: "",
				tel: "",
			};
		}
	};

	// saveImages(workbook) {
	// 	let x = workbook.model.media.find(
	// 		(m) => m.index === worksheetImages[0].imageId
	// 	);
	// 	let blob = new Blob([x.buffer]);
	// 	saveAs(blob, "x.png");

	// 	const worksheetImages = worksheet.getImages();
	// 	const findImage = (col, row) =>
	// 		worksheetImages.find(
	// 			(image) =>
	// 				image.range.tl.nativeCol === col - 1 &&
	// 				image.range.tl.nativeRow === row - 1
	// 		);
	// 	for (let i = 0; i < workbook.model.media.length; i++) {
	// 		let blob = new Blob([workbook.model.media[i].buffer]);
	// 		saveAs(blob, `${i}.png`);
	// 	}
	// }

	setFiles(files) {
		for (let i = 0; i < files.length; i++) {
			let extension = files[i].name.toString().split(".").pop();
			if (extension === VALID_EXCEL_EXTENSION) {
				this.files.push(files[i]);
			}
		}
		if (this.files.length) this.activeFileIdx = 0;
	}

	readSheet() {
		try {
			const colNames = this.materialColumns.map((col) => col.name);
			let materials = [];
			// Find first column cell by column's name
			for (let row = 1; row <= this.activeWorksheet.rowCount; row++) {
				const rowValues = this.activeWorksheet.getRow(row).values;
				const rowValuesConvert = rowValues.map((v) =>
					this.isString(v) ? v.toLowerCase().trim() : v
				);
				if (!rowValuesConvert.includes(this.materialColumns[0].name)) continue;
				for (let i = 0; i < rowValuesConvert.length; i++) {
					let foundIdx = colNames.indexOf(rowValuesConvert[i]);
					if (foundIdx !== -1)
						this.materialColumns[foundIdx].position = foundIdx + 1;
				}
				let highestColPos = this.materialColumns
					.map((item) => item.position)
					.reduce((prev, curr) => (prev > curr ? prev : curr), -1);
				if (highestColPos === -1) continue;

				for (
					let tableRowIdx = row + 1;
					tableRowIdx <= this.activeWorksheet.rowCount;
					tableRowIdx++
				) {
					const rootData = this.activeWorksheet.getRow(tableRowIdx).values;
					if (rootData.length < highestColPos) continue;
					let materialPos = this.materialColumns[0].position,
						fractionPos = this.materialColumns[1].position,
						supplierPos = this.materialColumns[2].position,
						distributorPos = this.materialColumns[3].position,
						productPos = this.materialColumns[4].position,
						groupPos = this.materialColumns[5].position,
						catalogNamePos = this.materialColumns[6].position,
						catalogImgPos = this.materialColumns[7].position,
						minPrdNamePos = this.materialColumns[8].position,
						minPrdImgPos = this.materialColumns[9].position
					let material = {
						name: this.getSafeString(rootData[materialPos]),
						fraction: this.getSafeString(rootData[fractionPos]),
						supplier: {
							name: this.getSafeString(rootData[supplierPos]),
							distributor: this.getSafeDistributor(rootData[distributorPos]),
						},
						catalog: {
							name: this.getSafeString(rootData[catalogNamePos]),
							imageUrl: typeof this.getSafeString(rootData[catalogImgPos]) == "object"
								?
								this.getSafeString(rootData[catalogImgPos]).hyperlink.split(" ").join("-") || this.getSafeString(rootData[catalogImgPos]).text.split(" ").join("-")
								:
								this.getSafeString(rootData[catalogImgPos]).split(" ").join("-"),
						},
						product: this.getSafeString(rootData[productPos]),
						group: this.getSafeString(rootData[groupPos]),
						miniProduct: {
							name: this.getSafeString(rootData[minPrdNamePos]),
							imageUrl: typeof this.getSafeString(rootData[minPrdImgPos]) == "object"
								?
								this.getSafeString(rootData[minPrdImgPos]).hyperlink.split(" ").join("-") || this.getSafeString(rootData[minPrdImgPos]).text.split(" ").join("-")
								:
								this.getSafeString(rootData[minPrdImgPos]).split(" ").join("-"),
						},
					};
					materials.push(material);
				}
				break;
			}
			this.groupResult(this.groupData(materials));
		} catch (e) {
			console.log(e);
		}
	}

	async readFile() {
		try {
			console.log("đã vào READ_FILE");
			if (this.activeFileIdx === null) return;
			const workbook = new ExcelJS.Workbook();
			var buffer = await this.files[this.activeFileIdx].arrayBuffer();

			const tempWorkbook = await workbook.xlsx.load(buffer);

			for (let i = 0; i < tempWorkbook.worksheets.length; i++) {
				this.activeWorksheet = tempWorkbook.worksheets[i];
				this.readSheet();
			}

			this.activeFileIdx =
				this.files.length - 1 > this.activeFileIdx
					? this.activeFileIdx + 1
					: null;
			await this.readFile();
		} catch (e) {
			console.log(e);
		}
	}


	splitGroupFirstTime(groups, colName, nextCol) {
		let data = [],
			newGroups = [];
		if (groups.length === 0) return { data, newGroups };

		data.push({ [colName]: groups[0][colName] });
		newGroups.push([{ ...groups[0], parentIdx: data.length - 1 }]);
		for (let i = 1; i < groups.length; i++) {
			const element = groups[i];
			if (
				element[colName] === groups[i - 1][colName] &&
				element[nextCol] !== groups[i - 1][nextCol]
			) {
				newGroups.push([{ ...element, parentIdx: data.length - 1 }]);
				continue;
			}

			if (element[colName] !== groups[i - 1][colName]) {
				newGroups.push([{ ...element, parentIdx: data.length }]);
				data.push({ [colName]: element[colName] });
				continue;
			}

			newGroups[newGroups.length - 1].push({
				...element,
				parentIdx: data.length - 1,
			});
		}
		return { data, newGroups };
	}

	splitGroup(groups, colName, nextCol, colParam, nextColParam) {
		let data = [],
			newGroups = [];
		for (let i = 0; i < groups.length; i++) {
			let firstDataGroup = colParam
				? { ...groups[i][0][colName] }
				: { [colName]: groups[i][0][colName] };
			data.push({
				...firstDataGroup,
				parentIdx: groups[i][0].parentIdx,
			});
			newGroups.push([{ ...groups[i][0], parentIdx: data.length - 1 }]);
			for (let j = 1; j < groups[i].length; j++) {
				const prevElement = groups[i][j - 1];
				const element = groups[i][j];
				const currCellNextCol = nextColParam
					? element[nextCol][nextColParam]
					: element[nextCol];
				const prevCellNextCol = nextColParam
					? prevElement[nextCol][nextColParam]
					: prevElement[nextCol];
				if (currCellNextCol !== prevCellNextCol) {
					newGroups.push([
						{
							...element,
							parentIdx: data.length - 1,
						},
					]);
					continue;
				}
				newGroups[newGroups.length - 1].push({
					...element,
					parentIdx: data.length - 1,
				});
			}
		}
		return { data, newGroups };
	}

	splitGroupLastTime(groups, colName) {
		let data = [];
		for (let i = 0; i < groups.length; i++) {
			for (let j = 0; j < groups[i].length; j++) {
				const element = groups[i][j];
				if (typeof element[colName] === "object") {
					data.push({ ...element[colName], parentIdx: element.parentIdx });
				} else {
					data.push({
						[colName]: element[colName],
						parentIdx: element.parentIdx,
					});
				}
			}
		}
		return data;
	}

	groupData(data) {
		let tempResult = {};
		let result = {};
		tempResult = this.splitGroupFirstTime(data, "name", "fraction");
		result.name = tempResult.data;
		tempResult = this.splitGroup(
			tempResult.newGroups,
			"fraction",
			"supplier",
			null,
			"name"
		);
		result.fraction = tempResult.data;
		tempResult = this.splitGroup(
			tempResult.newGroups,
			"supplier",
			"catalog",
			"name",
			"name"
		);
		result.supplier = tempResult.data;
		tempResult = this.splitGroup(tempResult.newGroups, "catalog", "product", "name");
		result.catalog = tempResult.data;
		tempResult = this.splitGroup(tempResult.newGroups, "product", "group");
		result.product = tempResult.data;
		tempResult = this.splitGroup(tempResult.newGroups, "group", "miniProduct");
		result.group = tempResult.data;
		tempResult = this.splitGroupLastTime(tempResult.newGroups, "miniProduct");
		result.miniProduct = tempResult;
		// console.log(result)
		return result;
	}

	groupResult(newMaterials) {
		if (!this.materials) {
			return this.materials = newMaterials
		}
		this.materials = {
			name: this.materials.name.concat(
				newMaterials.name
			),
			fraction: this.materials.fraction.concat(
				newMaterials.fraction.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.name.length })
				)
			),
			supplier: this.materials.supplier.concat(
				newMaterials.supplier.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.fraction.length })
				)
			),
			catalog: this.materials.catalog.concat(
				newMaterials.catalog.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.supplier.length })
				)
			),
			product: this.materials.product.concat(
				newMaterials.product.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.catalog.length })
				)
			),
			group: this.materials.group.concat(
				newMaterials.group.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.product.length })
				)
			),
			miniProduct: this.materials.miniProduct.concat(
				newMaterials.miniProduct.map(item =>
					({ ...item, parentIdx: item.parentIdx + this.materials.group.length })
				)
			),
		}
	}
}
