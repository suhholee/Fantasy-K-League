/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Button, Modal, Table, Col, Card } from 'react-bootstrap'

// Custom Components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { isAuthenticated, authenticated, loggedInUser } from '../../helpers/auth'

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
    }
  }

  return (
    <main className='team-selection'>
      <h1>Select Your Team</h1>
      <h4>Budget: {info.budget}m</h4>
      <p>You are allowed to select 11 players: 1 goalkeeper, max 5 defenders, max 5 midfielders, and max 3 forwards within the budget.</p>
      <p>No more than three players are allowed to be in the same team.</p>
      <div className='container'>
        <div className='player-selection'>
          {positions.map((position, i) => (
            <Button key={i} value={position} onClick={() => handlePositionClick(position)}>Select {position}</Button>
          ))}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton className='custom-modal'>
              <Modal.Title>{selectedPosition}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {players ?
                <>
                  <p className='howto'>Click the player to purchase.</p>
                  <p className='howto'>Budget: {info.budget}m</p>
                  <Table hover className='player-table'>
                    {/* Headers */}
                    <thead>
                      <tr className='text-center'>
                        <th>Player</th>
                        <th>Position</th>
                        <th>Price</th>
                        <th>Total Points</th>
                      </tr>
                    </thead>
                    {/* Body */}
                    {players.sort((a, b) => a.price < b.price ? 1 : -1).filter((player) => player.position === selectedPosition).map(player => {
                      const { id, name, position, price, total_points, team: { logo: logo } } = player
                      if (selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)) {
                        return (
                          <tbody key={id}>
                            <tr className='text-center selected' value={id} onClick={() => selectPlayer(player)}>
                              <td className='text-start'><img className='logo' src={logo}></img>{name}</td>
                              <td>{position}</td>
                              <td>{price}</td>
                              <td>{total_points}</td>
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
            <h4>You have selected {selectedPlayers.length} players.</h4>
            <div className='selected-player'>
              {selectedPlayers &&
                positions.map(position => {
                  return (
                    <div key={position} className='position-players'>
                      {selectedPlayers
                        .filter(player => player.position === position)
                        .map(player => {
                          const { id, name, position, team: { team: teamName, logo, next_match } } = player
                          return (
                            <div key={id} className='player-single'>
                              <img className='logo' src={logo} alt={`${teamName}`} />
                              <p>{name}</p>
                              <p>{next_match}</p>
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
      <Button onClick={handleSubmit}>Submit your team to play!</Button>
    </main>
  )
}

export default TeamSelection