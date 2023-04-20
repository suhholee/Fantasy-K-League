import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// Custom components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { authenticated, isAuthenticated, loggedInUser } from '../../helpers/auth'

const MyTeam = ({ getUserInfo }) => {

  // ! Variables
  const navigate = useNavigate()
  const { userId } = useParams()
  const positions = ['GK', 'DF', 'MF', 'FW']

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
        setInfoError(err.responseText)
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
      {info ?
        <Container className='selected-container'>
          <div className='selected-player'>
            {selectedPlayers &&
              positions.map(position => {
                return (
                  <div key={position} className='position-players'>
                    {selectedPlayers
                      .filter(player => player.position === position)
                      .map(player => {
                        const { id, name, gw_points, team: { team: teamName, logo, next_match } } = player
                        return (
                          <div key={id} className='player-single'>
                            <img className='logo' src={logo} alt={`${teamName}`} />
                            <p className='name'>{name}</p>
                            <p className='gw-points'>{gw_points}</p>
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
    </main>
  )

}

export default MyTeam