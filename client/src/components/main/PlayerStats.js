import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Table } from 'react-bootstrap'

// Custom Components
import { isAuthenticated, authenticated } from '../../helpers/auth'
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import playerImage from '../../images/feb_march_players.png'

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
  const [sortOrder, setSortOrder] = useState(1)
  const [sortField, setSortField] = useState('price')

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
        const highestPrice = Math.max(...data.map(player => player.price))
        const highestGwPoints = Math.max(...data.map(player => player.gw_points))
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

  const togglePrice = () => {
    if (sortField === 'price') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('price')
      setSortOrder(1)
    }
  }

  const toggleGwPoints = () => {
    if (sortField === 'gw_points') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('gw_points')
      setSortOrder(1)
    }
  }

  const toggleTotalPoints = () => {
    if (sortField === 'total_points') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('total_points')
      setSortOrder(1)
    }
  }


  return (
    <>
      {players ?
        <div className='player-stats-container'>
          <div className='header'>
            <h1>Player Stats</h1>
            <img src={playerImage} alt='playerImage' className='player-image' />
          </div>
          <div className='top-players'>
            <div className='top-players-container'>
              <h4>Most Expensive</h4>
              <div className='players'>
                {mostExpensive.map(player => {
                  const { name, price, team: { logo }, id } = player
                  return (
                    <div className='player-single' key={id}>
                      <img className='logo' src={logo}></img>
                      <p>{name}</p>
                      <p>{price}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='top-players-container'>
              <h4>Highest GW Points</h4>
              <div className='players'>
                {mostGwPoints.map(player => {
                  const { name, gw_points, team: { logo }, id } = player
                  return (
                    <div className='player-single' key={id}>
                      <img className='logo' src={logo}></img>
                      <p>{name}</p>
                      <p>{gw_points}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='top-players-container'>
              <h4>Total Points Leader</h4>
              <div className='players'>
                {mostTotalPoints.map(player => {
                  const { name, total_points, team: { logo }, id } = player
                  return (
                    <div className='player-single' key={id}>
                      <img className='logo' src={logo}></img>
                      <p>{name}</p>
                      <p>{total_points}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='select-buttons'>
            {positions.map((position, i) => (
              <Button key={i} className={position} value={position} onClick={() => handlePositionClick(position)}>{position}</Button>
            ))}
          </div>
          <Table hover className='player-table'>
            {/* Headers */}
            <thead>
              <tr className='text-center'>
                <th>Player</th>
                <th>Position</th>
                <th className='price' onClick={togglePrice}>Price<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
                <th className='gw-points' onClick={toggleGwPoints}>GW Points<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
                <th className='total-points' onClick={toggleTotalPoints}>Total Points<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
                <th>Next Match</th>
              </tr>
            </thead>
            {/* Body */}
            {players.filter(player => selectedPosition === 'All' || player.position === selectedPosition)
              .sort((a, b) => {
                if (sortField === 'price') {
                  return (b.price - a.price) * sortOrder
                } else if (sortField === 'gw_points') {
                  return (b.gw_points - a.gw_points) * sortOrder
                } else if (sortField === 'total_points') {
                  return (b.total_points - a.total_points) * sortOrder
                }
                return 0
              })
              .map(player => {
                const { id, name, position, price, gw_points, total_points, team: { logo, next_match } } = player
                return (
                  <tbody key={id}>
                    <tr className='text-center' value={id}>
                      <td className='text-start name'><img className='logo' src={logo}></img>{name}</td>
                      <td>{position}</td>
                      <td>{price}</td>
                      <td>{gw_points}</td>
                      <td>{total_points}</td>
                      <td>{next_match}</td>
                    </tr>
                  </tbody>
                )
              }
              )}
          </Table>
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