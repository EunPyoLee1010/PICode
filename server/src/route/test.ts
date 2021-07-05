import express from 'express'
import { ResponseCode } from '../constants/response'

const router = express.Router()

router.get('/test', (_, res) => {
    res.json({ code: ResponseCode.ok })
})

export default router