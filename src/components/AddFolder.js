import { addDoc, collection } from 'firebase/firestore'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../context/authContext'
import { db } from '../firebase'

const AddFolder = ({ currentFolder, setError }) => {
  const inputRef = useRef()
  const closeModalRef = useRef()
  const { user } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    e.target.disabled = true

    const name = inputRef.current.value

    if (!name.trim()) return

    await addDoc(collection(db, "drive"), {
      parentFolder: currentFolder,
      userUid: user.uid,
      name,
      type: "folder"
    }).catch(() => {
      setError("Something went wrong!")
    }).finally(() => {
      inputRef.current.value = ""
      closeModalRef.current.click()
      e.target.disabled = false
    })
  }

  return (
    <>
      <button className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addFolderModal">New Folder</button>
      {createPortal(
        <div className="modal fade" id="addFolderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Folder</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input required name="name" ref={inputRef} placeholder="Ex: My new folder" className="form-control" />
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" ref={closeModalRef} data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Create Folder</button>
              </div>
            </div>
          </div>
        </div>, document.getElementById("modal")
      )}
    </>
  )
}

export default AddFolder
