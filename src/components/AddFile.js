import { addDoc, collection } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useState } from "react"
import { useAuth } from "../context/authContext"
import { db, storage } from "../firebase"

const AddFile = ({ currentFolder, setError }) => {
  const [progress, setProgress] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const { user } = useAuth()

  const handleChange = e => {
    const file = e.target.files[0]
    
    if (!file) return

    setError(null)
    setDisabled(true)
    
    const storageReference = ref(storage, `/user/${user.uid}/${file.name}`)
    const uploadTask = uploadBytesResumable(storageReference, file)
    uploadTask.on(
      "state_changed",
      snapshot => {
        setProgress(snapshot.bytesTransferred / snapshot.totalBytes * 100)
      },
      () => {
        setError("Something went wrong!")
      },
      async () => {
        try {
          const url = await getDownloadURL(storageReference)
          await addDoc(collection(db, "drive"), {
            parentFolder: currentFolder,
            type: "file",
            userUid: user.uid,
            url,
            name: file.name
          })
        } catch {
          setError("Something went wrong!")
        } finally {
          setDisabled(false)
        }

        setProgress(0)
      }
    )
  }

  return (
    <>
      <button className="btn btn-primary position-relative" disabled={disabled} >
        Upload
        <input type="file" disabled={disabled} onChange={handleChange} className="file-picker" />
      </button>
      <div className="progress mx-2" style={{ flex: 1 }}>
        <div className="progress-bar" style={{ width: progress + "%" }} role="progressbar" aria-valuenow={progress} aria-valuemin={progress} aria-valuemax={progress}></div>
      </div>
    </>
  )
}

export default AddFile
