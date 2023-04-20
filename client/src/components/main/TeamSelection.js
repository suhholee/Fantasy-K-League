/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Button, Modal, Table, Col, Card } from 'react-bootstrap'

// Custom Components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { isAuthenticated, authenticated, loggedInUser, cannotEnterTeamSelection } from '../../helpers/auth'

const TeamSelection = ({ getUserInfo }) => {

  // ! Variables
  const { userId } = useParams()
  const navigate = useNavigate()
  const positions = ['GK', 'DF', 'MF', 'FW']

  // ! State
  const [info, setInfo] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [infoError, setInfoError] = useState('')
  const [playersError, setPlayersError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [sortOrder, setSortOrder] = useState(1)
  const [sortField, setSortField] = useState('price')

  // ! On Mount
  const getInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setInfo(data)
      setSelectedPlayers(data.selected_players)
      console.log(data.selected_players)
    } catch (err) {
      console.log(err)
      setInfoError(err.responseText)
    }
  }, [userId])

  useEffect(() => {
    !isAuthenticated() && navigate('/')
    cannotEnterTeamSelection() && navigate(`/myteam/${loggedInUser()}`)
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setPlayersError(err.responseText)
      }
    }
    getInfo()
    getPlayers()
  }, [userId])

  // ! Execution
  const selectPlayer = async (player) => {
    try {
      const updatedInfo = {
        selected_players: [{ id: player.id }],
      }
      console.log(player)
      const { data } = await authenticated.put(`/api/info/${loggedInUser()}/`, updatedInfo)
      setInfo(data)
      setSelectedPlayers(data.selected_players)
      console.log('SELECTED PLAYERS ->', data.selected_players)
      getUserInfo()
      setShowModal(false)
    } catch (err) {
      console.log(err.response)
      setInfoError(err.response.request.responseText)
    }
  }

  const handlePositionClick = (position) => {
    setSelectedPosition(position)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const handleSubmit = () => {
    if (selectedPlayers.length === 11) {
      navigate(`/myteam/${loggedInUser()}`)
      localStorage.setItem('User', loggedInUser())
    }
  }

  const togglePrice = () => {
    if (sortField === 'price') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('price')
      setSortOrder(-1)
    }
  }

  const togglePoints = () => {
    if (sortField === 'total_points') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('total_points')
      setSortOrder(-1)
    }
  }

  return (
    <main className='team-selection'>
      <h1>Select Your Team</h1>
      <div className='how-to-play'>
        <h4>How To Play</h4>
        <ul>
          <li>You are allowed to select 11 players: 1 GK, max 5 DFs, max 5 MFs, and max 3 FWs within the budget.</li>
          <li>No more than 3 players are allowed to be in the same team.</li>
          <li>If you want to undo a selection, remove a player first by clicking on the player in the player list pop-up, then add a new player to your team.</li>
          <li>You cannot change your team after submittion, so please think it through!</li>
        </ul>
      </div>
      <div className='container'>
        <div className='player-selection'>
          <div className='select-buttons'>
            {positions.map((position, i) => (
              <Button key={i} className={position} value={position} onClick={() => handlePositionClick(position)}>Select {position}</Button>
            ))}
          </div>
          <Modal show={showModal} onHide={handleClose} className='pop-up'>
            <Modal.Header closeButton className='custom-modal'>
              <Modal.Title>{selectedPosition}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {players ?
                <>
                  <p className='howto'>Click the player to purchase.<br></br>Click again to deselect.</p>
                  <p className='howto'>Budget: {info.budget}m</p>
                  <Table hover className='player-table'>
                    {/* Headers */}
                    <thead>
                      <tr className='text-center'>
                        <th>Player</th>
                        <th>Position</th>
                        <th className='price' onClick={togglePrice}>Price<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
                        <th className='points' onClick={togglePoints}>Total Points<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
                        <th>Next Match</th>
                      </tr>
                    </thead>
                    {/* Body */}
                    {players.filter((player) => player.position === selectedPosition)
                      .sort((a, b) => {
                        if (sortField === 'price') {
                          return (b.price - a.price) * sortOrder
                        } else if (sortField === 'total_points') {
                          return (b.total_points - a.total_points) * sortOrder
                        }
                        return 0
                      })
                      .map(player => {
                        const { id, name, position, price, total_points, team: { logo, next_match } } = player
                        if (selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)) {
                          return (
                            <tbody key={id}>
                              <tr className='text-center selected' value={id} onClick={() => selectPlayer(player)}>
                                <td className='text-start'><img className='logo' src={logo}></img>{name}</td>
                                <td>{position}</td>
                                <td>{price}</td>
                                <td>{total_points}</td>
                                <td>{next_match}</td>
                              </tr>
                            </tbody>
                          )
                        } else {
                          return (
                            <tbody key={id}>
                              <tr className='text-center' value={id} onClick={() => selectPlayer(player)}>
                                <td className='text-start name'><img className='logo' src={logo}></img>{name}</td>
                                <td>{position}</td>
                                <td>{price}</td>
                                <td>{total_points}</td>
                                <td>{next_match}</td>
                              </tr>
                            </tbody>
                          )
                        }
                      })}
                  </Table>
                </>
                :
                <>
                  {playersError ?
                    <Error error={playersError} />
                    :
                    <Spinner />
                  }
                </>
              }
            </Modal.Body>
          </Modal>
        </div>
        {info ?
          <Container className='selected-container'>
            <div className='budget'>
              <h4>Current Budget: {info.budget >= 10 ? 
                <span className='current-budget'>{info.budget}m</span>
                : info.budget < 10 && info.budget > 0 ? 
                  <span className='almost-no-budget'>{info.budget}m</span>
                  : <span className='no-budget'>{info.budget}m</span>}</h4>
            </div>
            <div className='selected-player'>
              {selectedPlayers &&
                positions.map(position => {
                  return (
                    <div key={position} className='position-players'>
                      {selectedPlayers
                        .filter(player => player.position === position)
                        .map(player => {
                          const { id, name, team: { team: teamName, logo, next_match } } = player
                          return (
                            <div key={id} className='player-single'>
                              <img className='logo' src={logo} alt={`${teamName}`} />
                              <p className='name'>{name}</p>
                              <p className='next-match'>{next_match}</p>
                            </div>
                          )
                        })}
                    </div>
                  )
                })
              }
            </div>
          </Container>
          :
          <>
            {infoError ?
              <Error error={infoError} />
              :
              <Spinner />
            }
          </>
        }
      </div>
      <Button className='submit-button' onClick={handleSubmit}>Submit your team to play!</Button>
    </main>
  )
}

export default TeamSelection