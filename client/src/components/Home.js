import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const Home = () => {
  return (
    <main className="home">
      <div className='home-container'>
        <h1>FANTASY K-LEAGUE</h1>
        <p>New User? Register to play against all.</p>
        <p>Already signed up? Login in to continue playing.</p>
        <div className='homeButton'>
          <Button to="/register" as={Link} className='btn'>Register</Button>
          <Button to="/login" as={Link} className='btn'>Login</Button>
        </div>
      </div>
    </main>
  )
}

export default Home