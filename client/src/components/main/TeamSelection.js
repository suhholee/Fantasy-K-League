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
  const [selectedGK, setSelectedGK] = useState({
    name: 'GK',
    position: 'GK',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedLB, setSelectedLB] = useState({
    name: 'DF',
    position: 'DF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedLCB, setSelectedLCB] = useState({
    name: 'DF',
    position: 'DF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedRCB, setSelectedRCB] = useState({
    name: 'DF',
    position: 'DF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedRB, setSelectedRB] = useState({
    name: 'DF',
    position: 'DF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedLM, setSelectedLM] = useState({
    name: 'MF',
    position: 'MF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedLCM, setSelectedLCM] = useState({
    name: 'MF',
    position: 'MF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedRCM, setSelectedRCM] = useState({
    name: 'MF',
    position: 'MF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedRM, setSelectedRM] = useState({
    name: 'MF',
    position: 'MF',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedLF, setSelectedLF] = useState({
    name: 'FW',
    position: 'FW',
    team: {
      logo: '',
      next_match: '',
    },
  })
  const [selectedRF, setSelectedRF] = useState({
    name: 'FW',
    position: 'FW',
    team: {
      logo: '',
      next_match: '',
    },
  })
  
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
      if (player.position === 'GK') {
        setSelectedGK(player)
      }
      if (player.position === 'DF' && selectedRB.name === 'DF' && selectedRCB.name === 'DF' && selectedLCB.name === 'DF' && selectedLB.name === 'DF') {
        setSelectedRB(player)
      } else if (player.position === 'DF' && selectedRCB.name === 'DF' && selectedLCB.name === 'DF' && selectedLB.name === 'DF') {
        setSelectedRCB(player)
      } else if (player.position === 'DF' && selectedLCB.name === 'DF' && selectedLB.name === 'DF') {
        setSelectedLCB(player)
      } else if (player.position === 'DF' && selectedLB.name === 'DF') {
        setSelectedLB(player)
      }
      if (player.position === 'MF' && selectedRM.name === 'MF' && selectedRCM.name === 'MF' && selectedLCM.name === 'MF' && selectedLM.name === 'MF') {
        setSelectedRM(player)
      } else if (player.position === 'MF' && selectedRCM.name === 'MF' && selectedLCM.name === 'MF' && selectedLM.name === 'MF') {
        setSelectedRCM(player)
      } else if (player.position === 'MF' && selectedLCM.name === 'MF' && selectedLM.name === 'MF') {
        setSelectedLCM(player)
      } else if (player.position === 'MF' && selectedLM.name === 'MF') {
        setSelectedLM(player)
      }
      if (player.position === 'FW' && selectedRF.name === 'FW' && selectedLF.name === 'FW') {
        setSelectedRF(player)
      } else if (player.position === 'FW' && selectedLF.name === 'FW') {
        setSelectedLF(player)
      }
    } catch (err) {
      console.log(err.response)
      setInfoError(err.response.request.responseText)
    }
  }

  const handlePositionClick = (position) => {
    setSelectedPosition(position)
    setShowModal(true)
    getUserInfo()
  }

  const handleClose = () => {
    setShowModal(false)
  }


  return (
    <main className='team-selection'>
      <h1>Select Your Team</h1>
      <div className='team-selection-container'>
        {info ?
          <Container className='selection-container'>
            <h4>Budget: {info.budget}m</h4>
            <div className='formation'>
              <div className='gk'>
                <div className='position-button' onClick={() => handlePositionClick(selectedGK.position)}>
                  <img className='logo' src={selectedGK.team.logo}></img>{selectedGK.name}
                </div>
              </div>
              <div className='df'>
                <div className='position-button' onClick={() => handlePositionClick(selectedRB.position)}>
                  <img className='logo' src={selectedRB.team.logo}></img>{selectedRB.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedRCB.position)}>
                  <img className='logo' src={selectedRCB.team.logo}></img>{selectedRCB.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedLCB.position)}>
                  <img className='logo' src={selectedLCB.team.logo}></img>{selectedLCB.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedLB.position)}>
                  <img className='logo' src={selectedLB.team.logo}></img>{selectedLB.name}
                </div>
              </div>
              <div className='mf'>
                <div className='position-button' onClick={() => handlePositionClick(selectedRM.position)}>
                  <img className='logo' src={selectedRM.team.logo}></img>{selectedRM.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedRCM.position)}>
                  <img className='logo' src={selectedRCM.team.logo}></img>{selectedRCM.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedLCM.position)}>
                  <img className='logo' src={selectedLCM.team.logo}></img>{selectedLCM.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedLM.position)}>
                  <img className='logo' src={selectedLM.team.logo}></img>{selectedLM.name}
                </div>
              </div>
              <div className='fw'>
                <div className='position-button' onClick={() => handlePositionClick(selectedRF.position)}>
                  <img className='logo' src={selectedRF.team.logo}></img>{selectedRF.name}
                </div>
                <div className='position-button' onClick={() => handlePositionClick(selectedLF.position)}>
                  <img className='logo' src={selectedLF.team.logo}></img>{selectedLF.name}
                </div>
              </div>
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
        {players ?
          <Modal show={showModal} onHide={handleClose} className='players-container'>
            <Modal.Header closeButton>
              <Modal.Title>{selectedPosition}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
          </Modal>
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