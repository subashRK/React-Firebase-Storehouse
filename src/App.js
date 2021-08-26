import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import CircularProgressbar from "./components/CircularProgressBar"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import FolderContainer from "./components/FolderContainer"
import { useAuth } from "./context/authContext"

const App = () => {
  const { user, loading } = useAuth()

  return (
    <div>
      {
        loading ? (
          <div className="center" style={{ height: "100vh" }}>
            <CircularProgressbar />
          </div>
        ) : user ? (
          <>
            <Navbar />
            <FolderContainer />
          </>
        ) : <Login />
      }
    </div>
  )
}

export default App
