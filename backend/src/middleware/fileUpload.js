import multer from "multer"
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "uploads/")
    },
    filename : (req , file , cb) => {
        cb(null , file.originalname + "-" + Date.now() )
    }
})

const uploadFile = multer({storage})
export default uploadFile
