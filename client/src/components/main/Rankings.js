import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Table, Modal } from 'react-bootstrap'

// Custom Components
import { authenticated, isAuthenticated, loggedInUser } from '../../helpers/auth'
import trophy from '../../images/trophy.png'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const Rankings = ({ getUserInfo }) => {

  // ! Variables
  const navigate = useNavigate()
  const { userId } = useParams()
  const positions = ['GK', 'DF', 'MF', 'FW']

  // ! State
  const [allInfo, setAllInfo] = useState([])
  const [allInfoError, setAllInfoError] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedUserData, setSelectedUserData] = useState([{
    gw_points: 0,
  }])
  const [showModal, setShowModal] = useState(false)

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getAllInfo = async () => {
      try {
        const { data } = await authenticated.get('/api/info/')
        setAllInfo(data)
      } catch (err) {
        console.log(err.response.statusText)
        setAllInfoError(err.response.statusText)
      }
    }
    getAllInfo()
    getUserInfo()
  }, [userId])

  // ! Executions
  const handleUserClick = (username) => {
    setSelectedUser(username)
    setShowModal(true)
    setSelectedUserData(allInfo.filter(info => info.user.username === username))
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      {allInfo ?
        <div className='rankings-container'>
          <div className='header'>
            <h1>World Rankings</h1>
            <img src={trophy} alt='trophy' className='trophy' />
          </div>
          <Table hover className='rankings-table'>
            {/* Headers */}
            <thead>
              <tr className='text-center'>
                <th>Rank</th>
                <th>Username</th>
                <th>Gameweek Points</th>
                <th>Total Points</th>
              </tr>
            </thead>
            {/* Body */}
            {allInfo.sort((a, b) => b.total_points - a.total_points).map((userInfo, rank) => {
              const { id, gw_points, total_points, user: { username, id: userId } } = userInfo
              return (
                <tbody key={id} className={userId === loggedInUser() ? 'user' : ''} onClick={() => handleUserClick(username)}>
                  <tr className='text-center'>
                    <td>{rank + 1}</td>
                    <td>{username}</td>
                    <td>{gw_points}</td>
                    <td>{total_points}</td>
                  </tr>
                </tbody>
              )
            })
            }
          </Table>
          <Modal show={showModal} onHide={handleClose} className='pop-up'>
            <Modal.Header closeButton className='custom-modal'>
              <Modal.Title>{selectedUser}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {allInfo &&
                <>
                  <div className='points'>
                    <div className='points-section'>
                      <h3 className='point'>{selectedUserData[0].gw_points}</h3>
                      <p>GW Points</p>
                    </div>
                  </div>
                  <div className='team'>
                    {positions.map(position => {
                      return (
                        <div key={position} className='ranking-players'>
                          {selectedUserData.map(user => {
                            const { selected_players } = user
                            return (
                              selected_players
                                .filter(player => player.position === position)
                                .map(player => {
                                  const { id, name, team: { team: teamName, logo, next_match }, gw_points } = player
                                  return (
                                    <div key={id} className='player-single'>
                                      <img className='logo' src={logo} alt={`${teamName}`} />
                                      <p className='name'>{name}</p>
                                      <p className='gw-points'>{gw_points}</p>
                                      <p className='next-match'>{next_match}</p>
                                    </div>
                                  )
                                })
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </>
              }
            </Modal.Body>
          </Modal>
        </div >
        :
        <>
          {allInfoError ?
            <Error error={allInfoError} />
            :
            <Spinner />
          }
        </>
      }
    </>
  )

}

export default Rankings