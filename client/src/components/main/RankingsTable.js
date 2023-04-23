import { Table } from 'react-bootstrap'

// Custom Components
import { loggedInUser } from '../../helpers/auth'

const RankingsTable = ({ allInfo, setSelectedUser, setShowModal, setSelectedUserData }) => {

  // ! Executions
  const handleUserClick = (username) => {
    setSelectedUser(username)
    setShowModal(true)
    setSelectedUserData(allInfo.filter(info => info.user.username === username))
  }

  return (
    <Table hover className='rankings-table'>
      {/* Headers */}
      <thead>
        <tr className='text-center'>
          <th>Rank</th>
          <th>Username</th>
          <th>Gameweek Points</th>
          <th>Total Points</th>
        </tr>
      </thead>
      {/* Body */}
      {allInfo.sort((a, b) => b.total_points - a.total_points).map((userInfo, rank) => {
        const { id, gw_points, total_points, user: { username, id: userId } } = userInfo
        return (
          <tbody key={id} className={userId === loggedInUser() ? 'user' : ''} onClick={() => handleUserClick(username)}>
            <tr className='text-center'>
              <td>{rank + 1}</td>
              <td>{username}</td>
              <td>{gw_points}</td>
              <td>{total_points}</td>
            </tr>
          </tbody>
        )
      })
      }
    </Table>
  )
}

export default RankingsTable