import { Modal } from 'react-bootstrap'

const RankingsModal = ({ showModal, setShowModal, selectedUser, allInfo, selectedUserData }) => {

  // ! Variables
  const positions = ['GK', 'DF', 'MF', 'FW']

  // ! Executions
  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <Modal show={showModal} onHide={handleClose} className='pop-up'>
      <Modal.Header closeButton className='custom-modal'>
        <Modal.Title>{selectedUser}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {allInfo &&
          <>
            <div className='points'>
              <div className='points-section'>
                <h3 className='point'>{selectedUserData[0].gw_points}</h3>
                <p>GW Points</p>
              </div>
            </div>
            <div className='team'>
              {positions.map(position => {
                return (
                  <div key={position} className='ranking-players'>
                    {allInfo.filter(info => info.user.username === selectedUser).map(user => {
                      const { selected_players } = user
                      return (
                        selected_players
                          .filter(player => player.position === position)
                          .map(player => {
                            const { id, name, team: { team: teamName, logo, next_match }, gw_points } = player
                            return (
                              <div key={id} className='player-single'>
                                <img className='logo' src={logo} alt={`${teamName}`} />
                                <p className='name'>{name}</p>
                                <p className='gw-points'>{gw_points}</p>
                                <p className='next-match'>{next_match}</p>
                              </div>
                            )
                          })
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </>
        }
      </Modal.Body>
    </Modal>
  )
}

export default RankingsModal