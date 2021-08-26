const CircularProgressbar = ({ small }) => {
  return (
    <div className={`spinner-border text-primary ${small && "spinner-border-sm"}`}  role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  )
}

export default CircularProgressbar
