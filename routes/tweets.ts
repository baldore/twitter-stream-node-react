import { Router } from 'express'
import { getTweets } from '../models/Tweet'

const router = Router()

router.get('/api/tweets/:page/:skip', async (req, res) => {
  const { page, skip } = req.params
  const tweets = await getTweets(page, skip)

  res.status(200).send({ tweets })
})

export default router
