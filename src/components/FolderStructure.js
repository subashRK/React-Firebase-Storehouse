const FolderStructure = ({ folderStructure, currentFolder, changeFolder }) => {
  return (
    <nav className="ms-3 mt-3" aria-label="breadcrumb">
      <ol className="breadcrumb">
        {currentFolder === null ? (
          <li className="breadcrumb-item active" aria-current="page" style={{ cursor: "pointer" }}>Root</li>
        ) : (
          <>
            <li className="breadcrumb-item breadcrumb-link" aria-current="page" style={{ cursor: "pointer" }} onClick={() => changeFolder(null)}>Root</li>
            {folderStructure.map((folder, i) => (
              <li className={`breadcrumb-item ${currentFolder === folder.id ? "active" : "breadcrumb-link"}`} aria-current="page" key={i} onClick={() => currentFolder !== folder.id && changeFolder({ name: folder.name, id: folder.id })}>{folder.name}</li>
            ))}
          </>
        )}
      </ol>
    </nav>
  )
}

export default FolderStructure
