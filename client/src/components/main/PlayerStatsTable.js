import { useState } from 'react'
import { Table } from 'react-bootstrap'

const PlayerStatsTable = ({ players, selectedPosition }) => {

  // ! State
  const [sortOrder, setSortOrder] = useState(1)
  const [sortField, setSortField] = useState('price')

  // ! Executions
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
  )

}

export default PlayerStatsTable