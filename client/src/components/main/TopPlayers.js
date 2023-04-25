// Custom Components
import playerImage from '../../images/feb_march_players.png'

const TopPlayers = ({ mostExpensive, mostGwPoints, mostTotalPoints, players }) => {

  return (
    <>
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
                  <p>{price}m</p>
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
                  <p>{gw_points} points</p>
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
                  <p>{total_points} points</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>

  )
}

export default TopPlayers