import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Bootstrap
import { Col, Button } from 'react-bootstrap'

// Custom components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { loggedInUser } from '../../helpers/auth'

const Login = () => {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const [teams, setTeams] = useState([])
  const [teamsError, setTeamsError] = useState('')

  // ! On Mount
  useEffect(() => {
    const getTeams = async () => {
      try {
        const { data } = await axios.get('/api/teams/')
        setTeams(data)
        console.log(data)
      } catch (err) {
        console.log(err.response.statusText)
        setTeamsError(err.response.statusText)
      }
    }
    getTeams()
  }, [])

  // ! Executions
  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setLoginError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formFields)
      localStorage.setItem('Fantasy-K-League', data.token)
      localStorage.setItem('User', loggedInUser())
      console.log(data)
      navigate(`/myteam/${loggedInUser()}`)
    } catch (err) {
      console.log(err.message)
      setLoginError('Invalid Email or Password. Try again.')
    }
  }

  return (
    <main className="home">
      <div className='top-container'>
        <h1><img className='logo' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681912719/shirts/kleague_white_siod3w.png' />FANTASY</h1>
        <div className="form-page text-center">
          <Col as="form">
            <h3 className='login-register-header'>Login</h3>
            <div className='inputs'>
              <div className='input-row'>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder='Type your email' onChange={handleChange} value={formFields.email} />
              </div>
              <div className='input-row'>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder='Type your password' onChange={handleChange} value={formFields.password} />
              </div>
            </div>
            <Button className='btn' onClick={handleSubmit}>CLICK TO PLAY ⚽️</Button>
            {loginError && <p className='text-danger text-center register-login-error'>{loginError}</p>}
          </Col>
          <div className='home-button'>
            <p>Don&#39;t have an account yet?</p>
            <a href='/register'>
              <p>Sign Up</p>
            </a>
          </div>
        </div>
      </div>
      <div className='teams'>
        {teams ?
          teams.map(team => {
            const { id, logo } = team
            return (
              <div key={id} className='team-logos'>
                <img src={logo} className='team-logo' />
              </div>
            )
          })
          :
          <>
            {teamsError ?
              <Error error={teamsError} />
              :
              <Spinner />
            }
          </>
        }
      </div>
    </main>
  )
}

export default Login