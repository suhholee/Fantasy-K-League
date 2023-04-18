/* eslint-disable camelcase */
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Button, Modal, Table } from 'react-bootstrap'

// Custom Components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { isAuthenticated, authenticated, loggedInUser } from '../../helpers/auth'

const TeamSelection = ({ getUserInfo }) => {

  // ! Variables
  const { userId } = useParams()
  const navigate = useNavigate()
  const positions = ['GK', 'DF', 'MF', 'FW']
  const formation = [
    ['GK'],
    ['DF', 'DF', 'DF', 'DF'],
    ['MF', 'MF', 'MF', 'MF'],
    ['FW', 'FW']
  ]

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
      console.log(data)
      getUserInfo()
      setShowModal(false)
    } catch (err) {
      console.log(err.response)
      setInfoError(err.response.request.responseText)
    }
  }

  return (
    <main className='team-selection'>
      <h1>Select Your Team</h1>
      <div className='team-selection-container'>
        {info ?
          <Container className='selection-container'>
            <h4>Budget: {info.budget}m</h4>
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
        {players ?
          <Container className='players-container'>
            <Table hover size="sm" className='player-table'>
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
              {players.sort((a, b) => a.price < b.price ? 1 : -1).map(player => {
                const { id, name, position, price, total_points, team: { logo: logo } } = player
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
              })}
            </Table>
          </Container>
          :
          <>
            {playersError ?
              <Error error={playersError} />
              :
              <Spinner />
            }
          </>
        }
      </div>
    </main>
  )
}

export default TeamSelection