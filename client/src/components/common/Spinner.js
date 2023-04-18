import spinnerGIF from '../../images/spinner.gif'

const Spinner = () => {
  return (
    <div className="spinner text-center">
      <img src={spinnerGIF} alt="Spinner" />
    </div>
  )
}

export default Spinner