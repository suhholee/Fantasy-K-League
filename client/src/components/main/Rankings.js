import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Table } from 'react-bootstrap'

// Custom Components
import { authenticated, isAuthenticated, loggedInUser } from '../../helpers/auth'
import trophy from '../../images/trophy.png'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const Rankings = ({ getUserInfo }) => {

  // ! Variables
  const navigate = useNavigate()
  const { userId } = useParams()

  // ! State
  const [allInfo, setAllInfo] = useState([])
  const [allInfoError, setAllInfoError] = useState([])

  // ! On Mount
  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getAllInfo = async () => {
      try {
        const { data } = await authenticated.get('/api/info/')
        setAllInfo(data)
      } catch (err) {
        console.log(err.response.statusText)
        setAllInfoError(err.response.statusText)
      }
    }
    getAllInfo()
    getUserInfo()
  }, [userId])

  return (
    <div className='rankings-container'>
      <div className='header'>
        <h1>World Rankings</h1>
        <img src={trophy} alt='trophy' className='trophy' />
      </div>
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
        {allInfo ?
          allInfo.sort((a, b) => b.total_points - a.total_points ? 1 : -1).map((userInfo, rank) => {
            const { id, gw_points, total_points, user: { username, id: userId } } = userInfo
            return (
              <tbody key={id} className={userId === loggedInUser() ? 'user' : ''}>
                <tr className='text-center'>
                  <td>{rank + 1}</td>
                  <td>{username}</td>
                  <td>{gw_points}</td>
                  <td>{total_points}</td>
                </tr>
              </tbody>
            )
          })
          :
          <>
            {allInfoError ?
              <Error error={allInfoError} />
              :
              <Spinner />
            }
          </>
        }
      </Table>
    </div>
  )

}

export default Rankings