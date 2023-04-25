import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

// Custom Components
import PlayerSelectModal from './PlayerSelectModal'
import SelectedPlayers from './SelectedPlayers'
import { isAuthenticated, authenticated, loggedInUser, cannotEnterTeamSelection } from '../../helpers/auth'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const TeamSelection = ({ getUserInfo }) => {

  // ! Variables
  const { userId } = useParams()
  const navigate = useNavigate()
  const positions = ['GK', 'DF', 'MF', 'FW']

  // ! State
  const [info, setInfo] = useState(null)
  const [players, setPlayers] = useState(null)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [infoError, setInfoError] = useState('')
  const [playersError, setPlayersError] = useState('')

  // ! On Mount
  const getInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setInfo(data)
      setSelectedPlayers(data.selected_players)
      console.log(data.selected_players)
    } catch (err) {
      console.log(err.message)
      setInfoError(err.message)
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
        setPlayersError(err.message)
      }
    }
    getInfo()
    getPlayers()
  }, [userId])

  // ! Execution
  const handleSubmit = () => {
    if (selectedPlayers.length === 11) {
      navigate(`/myteam/${loggedInUser()}`)
      localStorage.setItem('User', loggedInUser())
    }
  }

  return (
    <>
      {info ?
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
            <PlayerSelectModal positions={positions} info={info} setInfo={setInfo} selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} getUserInfo={getUserInfo} infoError={infoError} setInfoError={setInfoError} players={players} playersError={playersError} />
            <SelectedPlayers info={info} selectedPlayers={selectedPlayers} positions={positions} infoError={infoError} />
          </div>
          <Button className='submit-button' onClick={handleSubmit}>Submit your team to play!</Button>
        </main>
        :
        <>
          {infoError ?
            <Error error={infoError} />
            :
            <Spinner />
          }
        </>
      }
    </>
  )
}

export default TeamSelection