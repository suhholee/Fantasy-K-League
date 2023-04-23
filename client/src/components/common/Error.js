
const Error = ({ error }) => {
  console.log('error component ->', error)
  return (
    <div className="error">
      <h3 className="text-danger">{error}<br />Refresh the page to reload.</h3>
    </div>
  )
}

export default Error