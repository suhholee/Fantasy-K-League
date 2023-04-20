import { Table } from 'react-bootstrap'
import { useState } from 'react'

// Custom Components
import { authenticated, loggedInUser } from '../../helpers/auth'

const PlayerTable = ({ players, setInfo, selectedPlayers, setSelectedPlayers, getUserInfo, setShowModal, setInfoError, selectedPosition }) => {

  // ! State
  const [sortOrder, setSortOrder] = useState(1)
  const [sortField, setSortField] = useState('price')


  // ! Executions
  const selectPlayer = async (player) => {
    try {
      const updatedInfo = {
        selected_players: [{ id: player.id }],
      }
      console.log(player)
      const { data } = await authenticated.put(`/api/info/${loggedInUser()}/`, updatedInfo)
      setInfo(data)
      setSelectedPlayers(data.selected_players)
      console.log('SELECTED PLAYERS ->', data.selected_players)
      getUserInfo()
      setShowModal(false)
    } catch (err) {
      console.log(err.response)
      setInfoError(err.response.request.responseText)
    }
  }

  const togglePrice = () => {
    if (sortField === 'price') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('price')
      setSortOrder(-1)
    }
  }

  const togglePoints = () => {
    if (sortField === 'total_points') {
      setSortOrder(sortOrder * -1)
    } else {
      setSortField('total_points')
      setSortOrder(-1)
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
          <th className='points' onClick={togglePoints}>Total Points<img className='toggle-arrow' src='https://res.cloudinary.com/dtsgwp2x6/image/upload/v1681893221/shirts/toggle_arrow_v2ejm3.png' /></th>
          <th>Next Match</th>
        </tr>
      </thead>
      {/* Body */}
      {players.filter((player) => player.position === selectedPosition)
        .sort((a, b) => {
          if (sortField === 'price') {
            return (b.price - a.price) * sortOrder
          } else if (sortField === 'total_points') {
            return (b.total_points - a.total_points) * sortOrder
          }
          return 0
        })
        .map(player => {
          const { id, name, position, price, total_points, team: { logo, next_match } } = player
          if (selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)) {
            return (
              <tbody key={id}>
                <tr className='text-center selected' value={id} onClick={() => selectPlayer(player)}>
                  <td className='text-start'><img className='logo' src={logo}></img>{name}</td>
                  <td>{position}</td>
                  <td>{price}</td>
                  <td>{total_points}</td>
                  <td>{next_match}</td>
                </tr>
              </tbody>
            )
          } else {
            return (
              <tbody key={id}>
                <tr className='text-center' value={id} onClick={() => selectPlayer(player)}>
                  <td className='text-start name'><img className='logo' src={logo}></img>{name}</td>
                  <td>{position}</td>
                  <td>{price}</td>
                  <td>{total_points}</td>
                  <td>{next_match}</td>
                </tr>
              </tbody>
            )
          }
        })}
    </Table>
  )
}

export default PlayerTable