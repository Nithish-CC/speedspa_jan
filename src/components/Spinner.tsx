import React from 'react'
import { connect } from 'react-redux'

const Spinner = (props: any) => {

	return (
		<React.Fragment>
			{props.authenticated && props.loading && (
				<div id='loadingSpinner'>
					<i className='fa fa-spinner fa-spin fa-5x'></i>
				</div>
			)}
		</React.Fragment>
	)
}

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	loading: state.UI.loading
})

const mapActionsToProps = {}

export default connect(mapStateToProps, mapActionsToProps)(Spinner)
