import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Col } from 'react-bootstrap'

// Custom Components
import Error from '../common/Error'
import Spinner from '../common/Spinner'
import { isAuthenticated, authenticated, loggedInUser } from '../../helpers/auth'

const TeamSelection = () => {

  // ! Location Variables
  const { userId } = useParams()
  const navigate = useNavigate()

  // ! State
  const [ info, setInfo ] = useState([])
  const [ players, setPlayers ] = useState([])
  const [ infoError, setInfoError ] = useState('')
  const [ playersError, setPlayersError ] = useState('')

  // ! On Mount
  const getInfo = useCallback(async () => {
    try {
      const { data } = await authenticated.get(`/api/info/${loggedInUser()}/`)
      setInfo(data)
      console.log(data)
    } catch (err) {
      console.log(err)
      setInfoError(err.responseText)
    }
  }, [userId])

  useEffect(() => {
    !isAuthenticated() && navigate('/')
    const getPlayers = async () => {
      try {
        const { data } = await authenticated.get('/api/players/')
        setPlayers(data)
        console.log(data)
      } catch (err) {
        console.log(err)
        setPlayersError(err.responseText)
      }
    }
    getInfo()
    getPlayers()
  }, [userId])

  return (
    <>
    </>
  )
}

export default TeamSelection