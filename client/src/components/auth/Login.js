import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Login = ({ getUser }) => {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [ formFields, setFormFields ] = useState({
    email: '',
    password: '',
  })
  const [ loginError, setLoginError ] = useState('')

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
      console.log(data)
      navigate('/myteam')
    } catch (err) {
      console.log(err.message)
      setLoginError('Invalid Email or Password. Try again.')
    }
  }

  return (
    <main className="form-page text-center">
      <Container>
        <Row>
          <Col as="form" xs={{ span: 10, offset: 1 }} sm={{ span: 6, offset: 3 }} md={{ span: 4, offset: 4 }} onSubmit={handleSubmit}>
            <h1 className='text-center'>Login to Play</h1>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder='Email' onChange={handleChange} value={formFields.email} />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder='Password' onChange={handleChange} value={formFields.password} />
            <button className='btn btn-primary w-100'>Click to Play ⚽️</button>
            {loginError && <p className='text-danger text-center register-login-error'>{loginError}</p>}
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Login