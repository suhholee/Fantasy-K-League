import { Link, useLocation } from 'react-router-dom'

import { removeToken, loggedInUser } from '../../helpers/auth'
import { Nav, Navbar, Container } from 'react-bootstrap'

const PageNavbar = () => {

  // ! Location variables
  const location = useLocation()
  const noNav = ['/', '/login', '/register', `/teamselection/${loggedInUser()}`]

  // ! On Mount

  // ! Executions
  const handleLogout = () => {
    removeToken()
  }

  return (
    <>
      {!noNav.includes(location.pathname) &&
        <Navbar className='nav-bar' expand="md">
          <Container>
            <Navbar.Brand to={`/myteam/${loggedInUser()}`} as={Link} className='navbar-home'><img src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681917188/shirts/logo_40_b1ub3z.png' className='navbar-logo'/>FANTASY K-LEAGUE</Navbar.Brand>
            <Navbar.Toggle aria-controls="fantasy-nav" />
            <Navbar.Collapse id="fantasy-nav" className='justify-content-end'>
              <Nav className='navbar-text'>
                <Nav.Link to={`/rankings/${loggedInUser()}`} as={Link} className={location.pathname === `/rankings/${loggedInUser()}` ? 'active navbar-link border-bottom' : 'navbar-link'}>Rankings</Nav.Link>
                <Nav.Link to="/" as={Link} onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }
    </>
  )
}

export default PageNavbar