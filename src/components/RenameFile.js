import { doc, updateDoc } from "firebase/firestore"
import { useRef, useState } from "react"
import { db } from "../firebase"
import Error from "./Error"

const RenameFile = ({ name: currentName, id, setEdit }) => {
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleSubmit = e => {
    e.preventDefault()
    setError(null)

    const name = inputRef.current.value
    if (!name.trim() || name === currentName) return

    inputRef.current.disabled = true

    updateDoc(doc(db, `drive/${id}`), { name })
      .then(() => {
        if (!inputRef.current) return // If set edit changes to false, inputRef.current will be null
        inputRef.current.value = ""
        inputRef.current.disabled = false
        setEdit(false)
      })
      .catch(() => {
        if (!inputRef.current) return
        inputRef.current.value = ""
        inputRef.current.disabled = false
        setError("Something went wrong!")
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <Error error={error} />}
      <input name="name" ref={inputRef} className="form-control" required placeholder="Press enter to rename" />
    </form>
  )
}

export default RenameFile
