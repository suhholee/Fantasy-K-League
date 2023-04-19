import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Home from './components/Home'
import PageNavbar from './components/common/PageNavbar'
import PageNotFound from './components/common/PageNotFound'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import TeamSelection from './components/main/TeamSelection'
import MyTeam from './components/main/MyTeam'
import { authenticated, loggedInUser } from './helpers/auth'

const App = () => {

  const [ user, setUser ] = useState([])
  const [ userError, setUserError ] = useState('')

  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setUser({ ...data })
    } catch (err) {
      console.log(err)
      setUserError(err.message)
    }
  }, [])

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <div className='site-wrapper'>
      <BrowserRouter>
        <PageNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teamselection/:id" element={<TeamSelection getUserInfo={getUserInfo} />} />
          <Route path="/myteam/:id" element={<MyTeam getUserInfo={getUserInfo} />} />
          {/* Below route is rendered when nothing matches */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
