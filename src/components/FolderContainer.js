import { useEffect } from "react"
import { useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase"
import CircularProgressbar from "./CircularProgressBar"
import AddFile from "./AddFile"
import FilesList from "./FilesList"
import AddFolder from "./AddFolder"
import FolderStructure from "./FolderStructure"
import { useAuth } from "../context/authContext"
import Error from "./Error"

const FoldersContainer = () => {
  const [folderStructure, setFolderStructure] = useState([])
  const [files, setFiles] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    setFiles(null)
    
    const firestoreQuery = query(collection(db, "drive"), where("userUid", "==", user.uid), where("parentFolder", "==", currentFolder))

    const snapshot = onSnapshot(firestoreQuery, data => {
      setFiles(() => data.docs.map(currentDoc => ({ id: currentDoc.id, ...currentDoc.data() })))
    })

    return snapshot
  }, [user, currentFolder])

  const changeFolder = folder => {
    if (folder === null) {
      setFolderStructure([])
      setCurrentFolder(null)
      return
    }

    if (folderStructure.find(currentFolder => currentFolder.id === folder.id)) {
      const newFolderStructure = folderStructure

      for (let currentFolder in newFolderStructure) {
        if (currentFolder.id === folder.id) break
        newFolderStructure.pop()
      }

      setFolderStructure(newFolderStructure)
      setCurrentFolder(folder.id)
    } else {
      setFolderStructure(oldFolderStructure => [...oldFolderStructure, { name: folder.name, id: folder.id }])
      setCurrentFolder(folder.id)
    }
  }

  return (
    <div>
      {error && (
        <div className="m-3">
          <Error error={error} />
        </div>
      )}

      <FolderStructure currentFolder={currentFolder} changeFolder={changeFolder} folderStructure={folderStructure} />

      {
        !files ? (
          <div className="center" style={{ height: "70vh" }}>
            <CircularProgressbar />
          </div>
        ) : <FilesList files={files} changeFolder={changeFolder} />
      }
      <div className="fixed-bottom p-3 d-flex justify-content-between align-items-center">
        <AddFile currentFolder={currentFolder} setError={setError} />
        <AddFolder currentFolder={currentFolder} setError={setError} />
      </div>
    </div>
  )
}

export default FoldersContainer
