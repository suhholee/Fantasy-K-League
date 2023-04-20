import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Bootstrap imports
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button } from 'react-bootstrap'

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
  const [registerError, setRegisterError] = useState('')

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
    <main className='home'>
      <div className='top-container'>
        <div className='form-page-register'>
          <Col as='form'>
            <h3 className='login-register-header'>Sign Up</h3>
            <div className='inputs'>
              {/* Username */}
              <div className='input-row'>
                <label htmlFor='username'>Username</label>
                <input type='text' name='username' placeholder='Type your username' onChange={handleChange} value={formFields.username} />
              </div>
              {/* Email */}
              <div className='input-row'>
                <label htmlFor='email'>Email</label>
                <input type='text' name='email' placeholder='Type your email' onChange={handleChange} value={formFields.email} />
              </div>
              {/* Password */}
              <div className='input-row'>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' placeholder='Type your password' onChange={handleChange} value={formFields.password} />
              </div>
              {/* Password Confirmation */}
              <div className='input-row'>
                <label htmlFor='password_confirmation'>Password Confirmation</label>
                <input type='password' name='password_confirmation' placeholder='Confirm your password' onChange={handleChange} value={formFields.password_confirmation} />
              </div>
            </div>
            <Button className='btn' onClick={handleSubmit}>Sign up and select your team ➡️</Button>
            {registerError && <p className='text-danger text-center'>{registerError}</p>}
          </Col>
        </div>
      </div>
    </main>
  )
}

export default Register