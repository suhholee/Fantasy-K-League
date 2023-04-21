import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom components
import { authenticated, isAuthenticated, loggedInUser } from '../../helpers/auth'
import MyTeamPlayers from './MyTeamPlayers'

const MyTeam = ({ getUserInfo }) => {

  // ! Variables
  const navigate = useNavigate()
  const { userId } = useParams()

  // ! State
  const [info, setInfo] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [infoError, setInfoError] = useState('')

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getInfo = async () => {
      try {
        const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
        setInfo(data)
        setSelectedPlayers(data.selected_players)
        console.log(data)
      } catch (err) {
        console.log(err)
        setInfoError(err.response.statusText)
      }
    }
    getInfo()
    getUserInfo()
  }, [userId])

  return (
    <main className='my-team'>
      <h1>My Team</h1>
      <div className='points'>
        <div className='points-section'>
          <h3 className='point'>{info.gw_points}</h3>
          <p>GW Points</p>
        </div>
        <div className='points-section'>
          <h3 className='point'>{info.total_points}</h3>
          <p>Total Points</p>
        </div>
      </div>
      <MyTeamPlayers info={info} selectedPlayers={selectedPlayers} infoError={infoError} />
    </main>
  )

}

export default MyTeam