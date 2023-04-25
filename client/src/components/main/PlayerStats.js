import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

// Custom Components
import PlayerStatsTable from './PlayerStatsTable'
import TopPlayers from './TopPlayers'
import { isAuthenticated, authenticated } from '../../helpers/auth'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const PlayerStats = ({ getUserInfo }) => {

  // ! Variables
  const { userId } = useParams()
  const navigate = useNavigate()
  const positions = ['All', 'GK', 'DF', 'MF', 'FW']

  // ! State
  const [players, setPlayers] = useState(null)
  const [playersError, setPlayersError] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [mostExpensive, setMostExpensive] = useState([])
  const [mostGwPoints, setMostGwPoints] = useState([])
  const [mostTotalPoints, setMostTotalPoints] = useState([])

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
        const highestPrice = Math.max(...data.map(player => player.price))
        const highestGwPoints = []
        const highestTotalPoints = Math.max(...data.map(player => player.total_points))
        setMostExpensive(data.filter(player => player.price === highestPrice))
        setMostGwPoints(data.filter(player => player.gw_points === highestGwPoints))
        setMostTotalPoints(data.filter(player => player.total_points === highestTotalPoints))
      } catch (err) {
        console.log(err)
        setPlayersError(err.response.statusText)
      }
    }
    getPlayers()
    getUserInfo()
    setSelectedPosition('All')
  }, [userId])

  // ! Executions
  const handlePositionClick = (position) => {
    setSelectedPosition(position)
  }

  return (
    <>
      {players ?
        <div className='player-stats-container'>
          <TopPlayers mostExpensive={mostExpensive} mostGwPoints={mostGwPoints} mostTotalPoints={mostTotalPoints} players={players} />
          <div className='select-buttons'>
            {positions.map((position, i) => (
              <Button key={i} className={position} value={position} onClick={() => handlePositionClick(position)}>{position}</Button>
            ))}
          </div>
          <PlayerStatsTable players={players} selectedPosition={selectedPosition} />
        </div>
        :
        <>
          {playersError ?
            <Error error={playersError} />
            :
            <Spinner />
          }
        </>
      }
    </>
  )
}

export default PlayerStats