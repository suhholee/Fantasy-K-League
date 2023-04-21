import { Button, Modal } from 'react-bootstrap'
import { useState } from 'react'

// Custom Components
import PlayerTable from './PlayerTable'
import Error from '../common/Error'
import Spinner from '../common/Spinner'

const PlayerSelectModal = ({ positions, info, setInfo, selectedPlayers, setSelectedPlayers, getUserInfo, infoError, setInfoError, players, playersError }) => {

  // ! State
  const [selectedPosition, setSelectedPosition] = useState('')
  const [showModal, setShowModal] = useState(false)

  // ! Executions
  const handlePositionClick = (position) => {
    setSelectedPosition(position)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <div className='player-selection'>
      <div className='select-buttons'>
        {positions.map((position, i) => (
          <Button key={i} className={position} value={position} onClick={() => handlePositionClick(position)}>Select {position}</Button>
        ))}
      </div>
      <Modal show={showModal} onHide={handleClose} className='pop-up'>
        <Modal.Header closeButton className='custom-modal'>
          <Modal.Title>{selectedPosition}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {players ?
            <>
              <p className='howto'>Click the player to purchase.<br></br>Click again to deselect.</p>
              <p className='howto'>Current Budget: {info.budget >= 10 ?
                <span className='current-budget'>{info.budget}m</span>
                : info.budget < 10 && info.budget > 0 ?
                  <span className='almost-no-budget'>{info.budget}m</span>
                  : <span className='no-budget'>{info.budget}m</span>}</p>
              {infoError && <p className='error'>Player Selection is {infoError}.</p>}
            </>
            :
            <>
              {playersError ?
                <Error error={playersError} />
                :
                <Spinner />
              }
            </>
          }
          <PlayerTable players={players} setInfo={setInfo} selectedPlayers={selectedPlayers} setSelectedPlayers={setSelectedPlayers} getUserInfo={getUserInfo} setShowModal={setShowModal} setInfoError={setInfoError} selectedPosition={selectedPosition} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PlayerSelectModal