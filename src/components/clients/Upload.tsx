import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PageHeader from './../core/PageHeader'
import { Formik } from 'formik'
import { Form, Col, Row, FormControl, FormGroup, FormLabel } from 'react-bootstrap'
import { uploadClients } from '../../redux/actions/clientActions'
import XLSX from 'xlsx'

const Upload = (props: any) => {
	const [title] = useState('Upload Clients')
	const history = useHistory()
	const [uploadClients, setUploadClients] = useState({})
	
	const DownloadFile = () => {
		var fileName = 'upload-clients.xlsx'
		//Set the File URL.
		var url = process.env.PUBLIC_URL + '/assets/' + fileName

		//Create XMLHTTP Request.
		var req = new XMLHttpRequest()
		req.open('GET', url, true)
		req.responseType = 'blob'
		req.onload = (e: any) => {
			//Convert the Byte Data to BLOB object.
			var blob = new Blob([req.response], { type: 'application/octetstream' })
			//Check the Browser type and download the File.
			var isIE = false || !!document.documentMode
			if (isIE) {
				window.navigator.msSaveBlob(blob, fileName)
			} else {
				var url = window.URL || window.webkitURL
				var link = url.createObjectURL(blob)
				var a = document.createElement('a')
				a.setAttribute('download', fileName)
				a.setAttribute('href', link)
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
			}
		};
		req.send()
	}

	const downloadSampleExcel = () => {
		DownloadFile()
	}

	const [buttons] = useState([
		{
			title: 'Download Sample',
			callback: downloadSampleExcel
		}
	])

	const UI = useSelector((state: any) => state.UI)
	const user = useSelector((state: any) => state.user)

	const handleSubmit = () => {
		var data = {
			businessId: localStorage.getItem('businessId'),
			clients: uploadClients
		}
		props.uploadClients(data, history)
	};

	const handleCancel = (e: any) => {
		props.history.push('/clients')
	}

	const ProcessExcel = (data: any) => {
		var workbook = XLSX.read(data, {
			type: 'binary'
		});
		var firstSheet = workbook.SheetNames[0];
		var excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet])
		setUploadClients(excelRows)
	}

	const handleChangeExcel = () => {
		var fileToUpload: any = document.getElementById('file')
		//Validate whether File is valid Excel file.
		var regex = /^([a-zA-Z0-9\s_\\.\-:() ])+(.xls|.xlsx)$/
		if (regex.test(fileToUpload.value.toLowerCase())) {
			if (typeof (FileReader) != 'undefined') {
				var reader = new FileReader();
				//For Browsers other than IE.
				if (reader.readAsBinaryString) {
					reader.onload = (e: any) => {
						ProcessExcel(e.target.result)
					}
					reader.readAsBinaryString(fileToUpload.files[0])
				} else {
					//For IE Browser.
					reader.onload = (e: any) => {
						var data = '';
						var bytes = new Uint8Array(e.target.result)
						for (var i = 0; i < bytes.byteLength; i++) {
							data += String.fromCharCode(bytes[i])
						}
						ProcessExcel(data)
					};
					reader.readAsArrayBuffer(fileToUpload.files[0])
				}
			} else {
				alert('This browser does not support HTML5.')
				return false
			}
		} else {
			alert('Please upload a valid Excel file.')
			return false
		}
	}

	return (
		<React.Fragment>
			{user.authenticated && !UI.loading && (
				<React.Fragment>
					<PageHeader title={title} buttons={buttons} />
					<div className='row'>
						<div className='col-lg-12'>
							<div className='wrapper wrapper-content animated fadeInRight'>
								<div className='ibox float-e-margins'>
									<div className='ibox-content'>
										<Formik
											initialValues={{ file: null }}
											onSubmit={handleSubmit}
											enableReinitialize={true}
										>
											{({
												handleSubmit,
												isSubmitting
											}) => {
												return (
													<Form name='clientEdit' className='form-horizontal' noValidate autoComplete='off' onSubmit={handleSubmit}>
														<Row>
															<Col md='8'>
																{UI.errors && UI.errors.message && (
																	<div className='text-danger m-t-md m-b-md'>Can not save your data. {UI.errors.message}</div>
																)}
															</Col>
														</Row>
														<Row>
															<Col md='8'>
																<FormGroup>
																	<FormLabel className='col-sm-3 control-label'>Choose File</FormLabel>
																	<Col sm='9'>
																		<FormControl
																			type='file'
																			id='file'
																			name='file'
																			className='form-control'
																			onChange={() => handleChangeExcel()}
																		/>
																	</Col>
																</FormGroup>
															</Col>
														</Row>

														<div className='hr-line-dashed'></div>
														<div className='row'>
															<div className='col-md-8'>
																<div className='form-group'>
																	<div className='col-sm-9 col-sm-offset-3'>
																		<button className='btn btn-white' type='button' onClick={e => handleCancel(e)}>Cancel</button>&nbsp;
																		<button className='btn btn-primary' type='submit'>Upload
																			{UI.buttonLoading && (<i className='fa fa-spinner fa-spin'></i>)}
																		</button>
																	</div>
																	<div id='dvExcel'></div>
																</div>
															</div>
														</div>
													</Form>
												)
											}}
										</Formik>
									</div>
								</div>
							</div>
						</div>
					</div>
				</React.Fragment>
			)}
		</React.Fragment>
	)
}

const mapActionsToProps = {
	uploadClients
}

export default connect(null, mapActionsToProps)(Upload)
