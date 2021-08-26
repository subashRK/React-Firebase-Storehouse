import { useAuth } from "../context/authContext"

const Navbar = () => {
  const { user, signOut } = useAuth()

  const logout = async e => {
    e.target.classList.add("disabled")
    await signOut()
    e.target.classList.remove("disabled")
  }

  return (
    <nav className="navbar sticky-top navbar-light bg-light">
      <div className="container-fluid">
        <h1 className="navbar-brand normal-font me-2">Storehouse</h1>
        <ul className="navbar-nav me-auto">
          <li className="nav-link nav-item align-items-center" onClick={logout}>Logout</li>
        </ul>
        <div>
          <img src={user.photoURL} alt={user.displayName} className="avatar" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
