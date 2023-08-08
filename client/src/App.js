import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Container from '@mui/material/Container'

import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login } from './pages'
import { useDispatch } from 'react-redux'
import { fetchAuthMe } from './redux/slices/auth'

function App() {
	const dispatch = useDispatch()
	// const isAuth = useSelector(selectIsAuth)

	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [dispatch])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/posts/:id' element={<FullPost />} />
					<Route path='/posts/:id/edit' element={<AddPost />} />
					<Route path='/add-post' element={<AddPost />} />
					<Route path='/register' element={<Registration />} />
					<Route path='/login' element={<Login />} />
					<Route path='/tag/:tagname' element={<Home />} />
				</Routes>
			</Container>
		</>
	)
}

export default App
