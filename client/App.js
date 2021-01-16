import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import thene from './theme'


const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<MainRouter/>
			</ThemeProvider>
		</BrowserRouter>
		)
}