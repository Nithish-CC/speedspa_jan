import { connect } from 'react-redux'
import PageHeader from './core/PageHeader'

const Schedule = () => {
	return (
		<>
		<PageHeader/>
		<div className='middle-box text-center loginscreen animated fadeInDown'>
			<div>
				<div>
					<h1 className='logo-name'>
						<img src={process.env.PUBLIC_URL+'assets/logo.png'} alt="VNS logo" style={{width: '75%'}}/>
					</h1>
				</div>
			</div>
		</div>
		</>
	)
}

const mapStateToProps = () => ({})

const mapActionsToProps = {}

export default connect(mapStateToProps, mapActionsToProps)(Schedule)
