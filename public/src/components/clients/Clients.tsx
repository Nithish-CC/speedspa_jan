import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllClients, searchClients, deleteClient } from '../../redux/actions/clientActions'
import moment from "moment";
import PageHeader from '../../components/core/PageHeader'
import Pagination from "react-js-pagination"
import DeleteModal from '../core/DeleteModal'

const Clients = (props: any) => {
	const [errors, setErrors] = useState({} as Error)
	const [title] = useState('Clients')
	const [orderBy, setOrderBy] = useState(false)
	const [field, setField] = useState('createdAt')
	const [activePage, setActivePage] = useState(1)
	const [perPage] = useState(10)

	const [modalPopup, setModalPopup] = useState({
		deleteModal: false,
		id: '',
		name: '',
		index: ''
	})
	const [initialModalPopup] = useState({ ...modalPopup })

	const [text, setText] = useState('')
	const [status, setStatus] = useState('')

	const [buttons] = useState([
		{
			title: 'Add Client',
			url: 'clients/addnew'
		}, {
			title: 'Upload Clients',
			url: 'clients/upload'
		}
	])

	const UI = useSelector((state: any) => state.UI)
	const user = useSelector((state: any) => state.user)
	const allClients = user.allClients
   

	useEffect(() => {
		getAllClients()
		if (UI.errors) {
			setErrors(UI.errors)
		}
	}, [])

	const getAllClients = () => {
		const params = {
			businessId: localStorage.businessId,
			roles: 'client'
		}
		props.getAllClients(params)
	}

	const handleReset = (e: any) => {
		setText('')
		setStatus('')
		const params: any = {
			businessId: localStorage.businessId,
			roles: 'client',
			text: ''
		}
		props.searchClients(params)
	}

	const handleSearch = (e: any) => {
		const params: any = {
			businessId: localStorage.businessId,
			roles: 'client',
			text: text,
		}
		// if (status) {
		// 	params.filter['status']['$in']['0'] = status
		// }
		props.searchClients(params)
	}

	const handleSortChange = (key: any) => {
		if (field === key) {
			setOrderBy(!orderBy)
		} else {
			setOrderBy(true)
			setField(key)
		}
		allClients.sort(function (a: any, b: any) {
			const varA = (typeof a[key] === 'string')
				? a[key].toUpperCase() : a[key];
			const varB = (typeof b[key] === 'string')
				? b[key].toUpperCase() : b[key];
			let comparison = 0;
			if (varA > varB) {
				comparison = 1;
			} else if (varA < varB) {
				comparison = -1;
			}
			return (
				(orderBy === true) ? (comparison * -1) : comparison
			);
		})
	}

	const deletePopup = (client: any, index: any) => {
		setModalPopup({
			deleteModal: !modalPopup.deleteModal,
			id: client.id,
			name: client.firstName + ' ' + client.lastName,
			index: index
		})
	}

	const closeModal = () => {
		setModalPopup(initialModalPopup)
	}

	const handleDelete = () => {
		let params = {
			businessId: localStorage.getItem('businessId')
		}
		props.deleteClient(modalPopup.id, params)
		closeModal()
		allClients.splice(modalPopup.index, 1)
	}

	return (
		<>
			{user.authenticated && !UI.loading ?
				<>
					<PageHeader title={title} buttons={buttons} />
					<div className="row">
						<div className="col-lg-12">
							<div className="wrapper wrapper-content animated fadeInRight">
								<div className="ibox float-e-margins">
									<div className="ibox-content">
										<form role="form">
											<div className="row">
												<div className="col-md-5 col-sm-8">
													<div className="form-group">
														<label>Search</label>
														<input type="text" placeholder="Search by name or phone number" className="form-control" value={text} onChange={e => setText(e.target.value)} />
													</div>
												</div>
												<div className="col-md-3 col-sm-4">
													<div className="form-group">
														<label>Status</label>
														<select value={status} className="form-control" name="status" onChange={e => setStatus(e.target.value)}>
															<option value="">All</option>
															<option value="active">Active</option>
															<option value="inactive">Inactive</option>
														</select>
													</div>
												</div>
												<div className="col-md-4 col-sm-12">
													<div className="form-group">
														<div>
															<label>&nbsp;</label>
														</div>
														<button className="btn btn-info" type="button" onClick={e => handleReset(e)}>Reset</button>&nbsp;
														<button className="btn btn-primary" type="button" onClick={e => handleSearch(e)}>Search</button>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
								<div className="ibox float-e-margins">
									<div className="ibox-content">
										<div className="row">
											<div className="col-sm-12" style={{ 'marginBottom': '10px', 'textAlign': 'right' }}>
												{/* <excel-export data="vm.ExportToExcel()" name="Clients"></excel-export> */}
											</div>
										</div>
										<div className="table-responsive">
											<table className="table table-striped table-hover dataTables-example">
												<thead>
													<tr key="header">
														<th
															className={field != 'name' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}
															onClick={e => handleSortChange('name')}
														>Client Name</th>
														<th
															className={field != 'phoneNumber' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}
															onClick={e => handleSortChange('phoneNumber')}
														>Phone Number</th>
														<th
															className={field != 'email' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}
															onClick={e => handleSortChange('email')}
														>Email</th>
														<th
															className={field != 'dob' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}
															onClick={e => handleSortChange('dob')}
														>DOB</th>
														<th
															className={field != 'createdAt' ? 'sorting' : orderBy ? 'sorting_asc' : 'sorting_desc'}
															onClick={e => handleSortChange('createdAt')}
														>Date Added</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													{allClients && allClients.length ? (
														allClients.slice((activePage - 1) * perPage, activePage * perPage).map((client: any, index: any) => {
															return (
																<tr className="gradeX" key={index}>
																	<td>{client.firstName} {client.lastName}</td>
																	<td>{client.countryCode} {client.phoneNumber}</td>
																	<td>{client.email || '-'}</td>
																	<td>{client.dob ? moment(client.dob).format('MMMM dd') : '-'}</td>
																	<td>{moment(client.createdAt).format('MMM D, y')}</td>
																	<td>
																		<div style={{ 'position': 'relative' }}>
																			<button data-toggle="dropdown" className="btn btn-xs btn-gray dropdown-toggle"
																				type="button">Action
																				<span className="caret"></span>
																			</button>
																			<ul className="dropdown-menu">
																				<li>
																					<Link key={index} to={`/clients/view/${client.id}`}>
																						View/Edit
																					</Link>
																				</li>
																				<li>
																					<a onClick={() => deletePopup(client, index)}>Delete</a>
																				</li>
																			</ul>
																		</div>
																	</td>
																</tr>
															);
														})
													) : (
														<tr>
															<td colSpan={6} className="text-center">
																No Clients
															</td>
														</tr>
													)
													}
												</tbody>
											</table>
											{allClients.length > 10 ?
												<div className="text-right">
													<Pagination
														activePage={activePage}
														itemsCountPerPage={perPage}
														totalItemsCount={allClients.length}
														pageRangeDisplayed={5}
														onChange={(page: any) => setActivePage(page)}
													/>
												</div>
												:
												<></>
											}
										</div>
									</div>
								</div>
							</div>
							<DeleteModal
								title="client"
								modalPopup={modalPopup}
								closeModal={closeModal}
								handleDelete={handleDelete}
							/>
						</div>
					</div>
				</>
				:
				<></>
			}
		</>
	)
}

const mapActionsToProps = {
	getAllClients,
	searchClients,
	deleteClient
}

export default connect(null, mapActionsToProps)(Clients)
