import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Components
import Home from './components/Home'
import PageNotFound from './components/common/PageNotFound'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import TeamSelection from './components/main/TeamSelection'

const App = () => {

  return (
    <div className='site-wrapper'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/teamselection/:id" element={<TeamSelection />} />
          {/* Below route is rendered when nothing matches */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
