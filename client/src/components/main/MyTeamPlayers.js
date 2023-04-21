import { Container } from 'react-bootstrap'

// Custom components
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const MyTeamPlayers = ({ info, selectedPlayers, infoError }) => {

  // ! Variables
  const positions = ['GK', 'DF', 'MF', 'FW']

  return (
    <>
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
            <Error error={infoError.response.statusText} />
            :
            <Spinner />
          }
        </>
      }
    </>
  )

}

export default MyTeamPlayers