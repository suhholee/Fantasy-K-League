import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Bootstrap imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Register = () => {

  // ! Location variables
  const navigate = useNavigate()

  // ! State
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [ registerError, setRegisterError ] = useState('')

  // ! Executions

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
    setRegisterError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/register/', formFields)
      console.log(data)
      localStorage.setItem('Fantasy-K-League', data.token)
      navigate(`/teamselection/${data.data.id}`)
    } catch (err) {
      console.log(err.response.request.responseText)
      const errorMessage = err.response.request.responseText.replace('{"detail":{"non_field_errors":["', '').replace('"]}}', '').replace('{"detail":{"username":["', '')
      setRegisterError(errorMessage)
    }
  }

  return (
    <main className='form-page text-center'>
      <Container>
        <Row>
          <Col as='form' xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} onSubmit={handleSubmit} >
            <h1>Register to Play</h1>
            {/* Username */}
            <label htmlFor='username'>Username</label>
            <input type='text' name='username' placeholder='Username' onChange={handleChange} value={formFields.username}/>
            {/* Email */}
            <label htmlFor='email'>Email</label>
            <input type='text' name='email' placeholder='Email' onChange={handleChange} value={formFields.email}/>
            {/* Password */}
            <label htmlFor='password'>Password</label>
            <input type='password' name='password' placeholder='Password' onChange={handleChange} value={formFields.password}/>
            {/* Password Confirmation */}
            <label htmlFor='password_confirmation'>Password Confirmation</label>
            <input type='password' name='password_confirmation' placeholder='Password Confirmation' onChange={handleChange} value={formFields.password_confirmation}/>
            <button className='btn btn-primary'>To Team Selection →</button>
            {registerError && <p className='text-danger text-center'>{registerError}</p>}
          </Col>
        </Row>
      </Container>
    </main>
  )
}

export default Register