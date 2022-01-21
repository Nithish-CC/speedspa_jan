import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
// import "../../scss/messages.scss"

const Terminals = (props: any) => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	})
	const [errors, setErrors] = useState({} as Error)
	const [loading, setLoading] = useState(false)

	const hostname = 'demo-sofabnails.savantsaloncrm.com'
	// const hostname = window.location.hostname

	// const getBussinessDetails = () => {
	// 	props.getBusinessDetails(hostname)
	// }

	// const UI = useSelector((state: any) => state.UI)

	// useEffect(() => {
	// 	getBussinessDetails()
	// 	if (UI.errors) {
	// 		setErrors(UI.errors)
	// 	}
	// 	setLoading(UI.loading)
	// }, [hostname])

	// const handleSubmit = (e: any) => {
	// 	e.preventDefault()
	// 	setLoading(UI.loading)
	// 	const userData = {
	// 		email: values.email,
	// 		password: values.password,
	// 	}
	// 	props.loginUser(userData, props.history)
	// }

	// const handleChange = (e: any) => {
	// 	e.persist()
	// 	setValues(values => ({
	// 		...values,
	// 		[e.target.name]: e.target.value,
	// 	}))
	// }

	return (
		<div className='row'>
			<div className='col-lg-12'>
				<div className='wrapper wrapper-content animated fadeInRight'>
					<div className='ibox float-e-margins'>
						<div className='ibox-content'>
							<div className='table-responsive'>
								<table className='table table-striped table-hover dataTables-example'>
									<thead>
										<tr>
											<th>Name</th>
											<th>Description</th>
											<th>Device Type</th>
											<th>Device Type Name</th>
											<th>Merchant Id</th>
											{/* <!-- <th>Action</th> --> */}
										</tr>
									</thead>
									<tbody>
										<tr className='gradeX' ng-repeat='terminal in vm.terminals'>
											{/* <td>{terminal.name}</td>
                                    <td>{terminal.description}</td>
                                    <td>{terminal.deviceType}</td>
                                    <td>{terminal.deviceTypeName}</td>
                                    <td>{terminal.merchantId}</td> */}
											{/* <!-- <td>
                                        <div style="position: relative">
                                            <a delete-item-button item="terminal" items="vm.terminals"
                                                item-type="terminal" item-name="(terminal.name)"
                                                item-callback="vm.delete">Delete</a>
                                        </div>
                                    </td> --> */}
										</tr>
										<tr className='text-center' ng-if='vm.terminals.length <= 0'>
											<td colSpan={5}>{'No Terminals'}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state: any) => ({})

const mapActionsToProps = {}

export default connect(mapStateToProps, mapActionsToProps)(Terminals)
