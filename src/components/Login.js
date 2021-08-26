import { useState } from "react"
import { useAuth } from "../context/authContext"
import Error from "./Error"

const Login = () => {
  const [error, setError] = useState(null)
  const { signInWithGoogle } = useAuth()

  const login = e => {
    e.target.disabled = true
    
    signInWithGoogle()
      .catch(e => {
        setError(e.message)
        e.target.disabled = false
      })
  }

  return (
    <div>
      {error && (
        <div className="m-3">
          <Error error={error} />
        </div>
      )}
      <div className="center" style={{ height: error ? "90vh" : "100vh" }}>
        <button className="btn btn-danger" onClick={login}>Login via Google</button>
      </div>
    </div>
  )
}

export default Login
