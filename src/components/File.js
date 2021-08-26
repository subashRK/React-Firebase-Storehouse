import { collection, deleteDoc, doc, getDocs, query, writeBatch, where } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useState } from "react"
import { useAuth } from "../context/authContext"
import { db, storage } from "../firebase"
import Error from "./Error"
import CircularProgressBar from "./CircularProgressBar"
import RenameFile from "./RenameFile"

const File = ({ id, name, type, url, parentFolder, changeFolder }) => {
  const [edit, setEdit] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const deleteFile = async () => {
    try {
      if (!window.confirm(`Are you sure?${type === "folder" && "If you delete this folder the child folders will be moved this folder."}`)) return

      setDisabled(true)

      if (type === "file") await deleteObject(ref(storage, `/user/${user.uid}/${name}`))
      if (type === "folder") {
        const childFiles = await getDocs(query(collection(db, "drive"), where("parentFolder", "==", id), where("userUid", "==", user.uid)))
        if (childFiles.empty) return await deleteDoc(doc(db, `drive/${id}`))

        const batch = writeBatch(db)
        childFiles.forEach(currentFile => batch.update(currentFile.ref, { parentFolder }))
        await batch.commit()
      }

      await deleteDoc(doc(db, `drive/${id}`))
    } catch {
      setError("Something went wrong!")
      setDisabled(false)
    }
  }

  const goTo = () => {
    if (type === "folder") return changeFolder({ name, id })
    window.open(url, "_blank")
  }

  return (
    <div key={id} className="card px-3 py-2 mb-3 ms-3" style={{ maxWidth: "90%", width: 300 }}>
      {error && <Error error={error} />}
      {!edit ? <span>{name} {type === "file" && <span className="badge bg-secondary">File</span>}</span> : <RenameFile setEdit={setEdit} name={name} id={id} />}
      <hr />
      <div className="d-flex align-items-center justify-content-between mx-5">
        {
          !disabled ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16" onClick={goTo}>
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16" onClick={deleteFile}>
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16" onClick={() => setEdit(oldEdit => !oldEdit)}>
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
              </svg>
            </>
          ) : (
            <div className="d-flex justify-content-center" style={{ width: "100%" }}>
              <CircularProgressBar small />
            </div>
          )
        }
        
      </div>
    </div>
  )
}

export default File
