import './scss/style.scss'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import { CheckAuthentication } from './utils/CheckAuthentication'
import Routes from './Routes'
import './utils/AxiosConfig'

const App: React.FunctionComponent = () => {
	useEffect(() => {
		CheckAuthentication()
	}, [])
	return (
		<div className='App'>
			<Provider store={store}>
				<Routes />
			</Provider>
		</div>
	)
}

export default App
