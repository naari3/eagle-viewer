import { readFile } from 'fs/promises'
import type { NextApiRequest, NextApiResponse } from 'next'
import { basename, join } from 'path'
import * as mime from 'mime-types'

export default async function userHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
      query: { id },
      method,
    } = req
  
    switch (method) {
      case 'GET':
        const result = await (await fetch(`http://localhost:41595/api/item/info?id=${id}`)).json()
        console.log(result)
        const imagePath = join("/Users/yuki_sone/Pictures/eagler.library/images", `${result.data.id}.info`, `${result.data.name}.${result.data.ext}`)
        const mimeType = mime.lookup(basename(imagePath))
        const image = await readFile(imagePath)
        if (mimeType) {
            res.setHeader('Content-Type', mimeType)
        }
        res.status(200).send(image)
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
  