import React, { useEffect, useState } from "react";
import { Form, Col, Row, FormControl, FormGroup, FormLabel, Button } from "react-bootstrap";
import { uploadImage, getImageFile } from "../../../redux/actions/staffActions";
import { connect, useSelector } from "react-redux";

const ProductImage = (props: any) => {
	const [imageSortUrl, setImageSortUrl] = useState<any[]>([]);
	const [imageButtonHandle, setImageButtonHandle] = useState("Click Add");
	const [imageToUpload, setImageToUpload] = useState([]);
	const [stopLoading, setStopLoading] = useState("loading");
	const [avatarImg, setAvatarImg] = useState("");
	const [imgValKeys, setImgValKeys] = useState("");
	const [checkurl, setCheckUrl] = useState<any[]>([]);

	// Image Tab
	const imgSortView = (e: any, key: any) => {
		const productData = [...imageSortUrl];
		productData[key].index = Number(e.target.value);
		setImageSortUrl(productData);
	};

	const imgPass = (image: any) => {
		if (props.view == false) {
			imageSortUrl.push({ image: image, index: imageSortUrl.length + 1 });
		} else if (props.view == true) {
			imageSortUrl.push({ image: image, index: imageSortUrl.length + 1 });
		}
	};

	const _arrayBufferToBase64 = (buffer: any) => {
		var binary = "";
		var bytes = new Uint8Array(buffer);
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};

	const uploadFileImage = (files: any) => {
		const imageToSave = new FormData();
		imageToSave.append("input", files[0]);
		props.props.uploadImage(imageToSave, (success: any, key: any, url: any) => {
			if (success) {
				getImageFileData(key);
				imgPass(url);
				setStopLoading("no loading");
			}
		});
	};

	const getImageFileData = (imageName: any) => {
		setImgValKeys(imageName);
		let values = {
			imageName: imageName,
		};
		let bussinesId = {
			bussinessId: props.bussinessId,
		};
		props.props.getImageFile(values, bussinesId, (success: any, valres: any) => {
			if (success) {
				let imageURL = getImageURL(valres);
				let avatar_image = "data:image/png;base64," + _arrayBufferToBase64(imageURL);
				setAvatarImg(avatar_image);
			}
		});
	};

	const getImageURL = (res: any) => {
		return res.data.Body.data;
	};

	const Sortable = (imageSortUrl: any) => {
		const sortedValues = imageSortUrl.sort(function (a: any, b: any) {
			return a.index - b.index;
		});
		const tempArr: any[] = [];
		sortedValues.forEach((element: any) => {
			tempArr.push(element.image);
		});
		setCheckUrl(tempArr);
		setImageSortUrl(imageSortUrl);
	};

	const handleRemoveImage = (index: any) => {
		imageSortUrl.splice(index, 1);
		Sortable(imageSortUrl);
	};

	return (
		<React.Fragment>
			<Row>
				<Col sm="12">
					<div className="row">
						<div className="col-md-6">
							<table className="table table-striped table-bordered table-hover dataTables-example">
								<thead>
									<tr>
										<th
											style={{
												textAlign: "center",
											}}>
											Image preview
										</th>
										<th
											style={{
												display: "none",
											}}>
											Image url
										</th>
										<th
											style={{
												textAlign: "center",
											}}>
											Sort order
										</th>
										<th
											style={{
												textAlign: "center",
											}}>
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{imageSortUrl && imageSortUrl.length ? (
										imageSortUrl.map((url: any, key: any) => {
											return (
												<tr>
													<td
														style={{
															textAlign: "center",
														}}>
														<img
															id={`image_${key}`}
															border="0"
															align=""
															width="200"
															height="200"
															style={{
																width: "100px",
																height: "auto",
															}}
															src={url.image}
														/>
													</td>
													<td
														style={{
															display: "none",
														}}>
														<input type="text" className="form-control" disabled />
													</td>
													<td
														style={{
															width: "100px",
															textAlign: "center",
														}}>
														<input
															type="number"
															className="form-control"
															name={`image_${key}`}
															value={url.index}
															onChange={(e: any) => imgSortView(e, key)}
														/>
													</td>
													<td
														style={{
															width: "100px",
															textAlign: "center",
														}}>
														<button
															className="btn btn-white"
															type="button"
															onClick={(e) => handleRemoveImage(key)}>
															<i className="fa fa-trash" />
														</button>
													</td>
												</tr>
											);
										})
									) : (
										<React.Fragment></React.Fragment>
									)}
								</tbody>
							</table>

							{imageButtonHandle == "image upload" && (
								<div className="form-group">
									<div className="col-sm-6">
										<input
											type="file"
											className="form-control"
											id="fileToUpload"
											onChange={(event) => {
												setImageToUpload(event.target.files);
											}}
										/>
									</div>
									<div className="col-sm-6 text-right">
										<button
											className="btn btn-white"
											type="button"
											onClick={(event) => uploadFileImage(imageToUpload)}>
											Upload image
											{props.UI.buttonLoading && (
												<React.Fragment>
													<i className="fa fa-spinner fa-spin"></i>
												</React.Fragment>
											)}
											{!props.UI.buttonLoading &&
												stopLoading == "no loading" &&
												setImageButtonHandle("Click Add")}
										</button>{" "}
										&nbsp;
										<button
											className="btn btn-white"
											type="button"
											onClick={(e: any) => {
												setImageButtonHandle("Click Add");
											}}>
											Cancel
										</button>
									</div>
								</div>
							)}
							{imageButtonHandle == "Click Add" && (
								<div className="form-group">
									<div className="col-sm-12 text-right">
										<button
											className="btn btn-white"
											type="button"
											onClick={() => {
												setImageButtonHandle("image upload");
												setStopLoading("loading");
											}}>
											Add image
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</Col>
			</Row>
		</React.Fragment>
	);
};

const mapActionsToProps = {
	uploadImage,
	getImageFile
};

export default connect(null, mapActionsToProps)(ProductImage);

