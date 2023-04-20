import { Container } from 'react-bootstrap'

// Custom components
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const SelectedPlayers = ({ info, selectedPlayers, positions, infoError }) => {

  return (
    <>
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
    </>
  )
}

export default SelectedPlayers