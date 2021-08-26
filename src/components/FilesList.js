import File from "./File"

const FilesList = ({ files, changeFolder }) => {
  return (
    files.length === 0 ? (
      <div className="center" style={{ height: "60vh" }}>
        <h2 className="normal-font">No Files Found!</h2>
      </div>
    ) : (
      <div className="row m-2 align-items-start">
        {files.map(({ id, name, type, url, parentFolder }) => (
          <File 
            key={id}
            id={id}
            name={name}
            type={type}
            url={url}
            parentFolder={parentFolder}
            changeFolder={changeFolder}
          />
        ))}
      </div>
    )
  )
}

export default FilesList
