import { Router } from "express";
import multer from "multer"
import { postMySite } from "../services/postMySite.service";
import { postOlx } from "../services/postOlx.service";
import path from 'path'

const router = Router()

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, Date.now() + ext)
    }
  })

  const upload = multer({ storage })

router.post('/post', upload.array('photos', 5), async (req, res) => {
    try {
        console.log('route hit, files:', req.files?.length ?? 'none')
        if(!req.files || req.files.length === 0) return res.status(400).json({message: "Нужны изображения"})
        const images = req.files as Express.Multer.File[]
        await postMySite(req.body, images)
        await postOlx(req.body.title, req.body.description, req.body.price, images)
        return res.status(201).json({message: "Completed"})
    } catch(e: any) {
        console.error('route error:', e.message)
        return res.status(500).json({message: e.message})
    }
})

export default router