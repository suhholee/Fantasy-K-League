import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import PageNavbar from './components/common/PageNavbar'
import PageNotFound from './components/common/PageNotFound'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import TeamSelection from './components/main/TeamSelection'
import Rankings from './components/main/Rankings'
import MyTeam from './components/main/MyTeam'
import PlayerStats from './components/main/PlayerStats'
import { authenticated, loggedInUser } from './helpers/auth'

const App = () => {

  // ! State
  const [ user, setUser ] = useState([])
  const [ userError, setUserError ] = useState('')

  // ! On Mount
  const getUserInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setUser({ ...data })
    } catch (err) {
      console.log(err)
      setUserError(err.message)
    }
  }, [])

  return (
    <div className='site-wrapper'>
      <BrowserRouter>
        <PageNavbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teamselection/:id" element={<TeamSelection getUserInfo={getUserInfo} />} />
          <Route path="/myteam/:id" element={<MyTeam getUserInfo={getUserInfo} />} />
          <Route path="/rankings/:id" element={<Rankings getUserInfo={getUserInfo} />} />
          <Route path="/playerstats/:id" element={<PlayerStats getUserInfo={getUserInfo} />} />
          {/* Below route is rendered when nothing matches */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
