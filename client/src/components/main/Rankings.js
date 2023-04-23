import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Custom Components
import RankingsTable from './RankingsTable'
import { authenticated, isAuthenticated } from '../../helpers/auth'
import trophy from '../../images/trophy.png'
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import RankingsModal from './RankingsModal'

const Rankings = ({ getUserInfo }) => {

  // ! Variables
  const navigate = useNavigate()
  const { userId } = useParams()

  // ! State
  const [allInfo, setAllInfo] = useState(null)
  const [allInfoError, setAllInfoError] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedUserData, setSelectedUserData] = useState([{
    gw_points: 0,
  }])
  const [showModal, setShowModal] = useState(false)

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
    <>
      {allInfo ?
        <div className='rankings-container'>
          <div className='header'>
            <h1>World Rankings</h1>
            <img src={trophy} alt='trophy' className='trophy' />
          </div>
          <RankingsTable allInfo={allInfo} setSelectedUser={setSelectedUser} setShowModal={setShowModal} setSelectedUserData={setSelectedUserData} />
          <RankingsModal showModal={showModal} setShowModal={setShowModal} selectedUser={selectedUser} allInfo={allInfo} selectedUserData={selectedUserData} />
        </div>
        :
        <>
          {allInfoError ?
            <Error error={allInfoError} />
            :
            <Spinner />
          }
        </>
      }
    </>
  )

}

export default Rankings