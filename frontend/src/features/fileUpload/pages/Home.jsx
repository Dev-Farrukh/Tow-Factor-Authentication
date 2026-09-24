import { useRef, useState } from "react"
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadFile } from "../../Authentication/api/auth.api";
import { App, Button } from "antd";
const Home = () => {
  const fileRef = useRef()
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const { notification } = App.useApp()

  const handleUpload = async () => {
    try {
      await uploadFile(file)
      notification.success({
        title: 'File uploaded successfully',
      })
      handleDelete();
    } catch (error) {
      notification.error({
        title: 'Something went wrong',
        description: error?.response?.data?.message || error?.message
      })
    }

  }

  const handleChoosee = () => fileRef.current.click()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const inputHandler = (event) => {
    event.preventDefault()
    setFile(event.target.files[0])
  }
  const handleDrop = (event) => {
    setIsDragging(false)
    event.preventDefault()
    setFile(event?.dataTransfer.files[0])
  }
  const handleDelete = () => {
    fileRef.current.value = ""
    setFile(null)
  }
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h2 className="text-center text-4xl" >Handling Files</h2>

      <input type="file" name="fileInput" ref={fileRef} className="hidden" onChange={inputHandler} />

      <button className={`h-60 sm:w-[30%] border-2 border-dotted rounded-lg mt-3 w-full cursor-pointer 
      ${isDragging
          ? "border-blue-500 bg-zinc-800"
          : "border-zinc-700 hover:bg-zinc-900"}
      `}
        onClick={handleChoosee}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center flex-col gap-4">
          <UploadOutlined className=" text-5xl" />
          <h4 className="text-2xl">Upload files</h4>
        </div>
      </button>

      {file &&
        <>
          <div className="flex justify-between sm:w-[30%] w-full px-2">
            <h3 className="text-2xl">Your File : <span className="font-semibold">  {file?.name}</span></h3>
            <button className="cursor-pointer text-gray-400 hover:text-red-400" onClick={handleDelete}><DeleteOutlined className="text-2xl" /></button>
          </div>
          <Button className="sm:w-[30%] w-full " style={{ paddingBlock: "25px" }} onClick={handleUpload}> Upload</Button>
        </>
      }
    </div>
  )
}

export default Home