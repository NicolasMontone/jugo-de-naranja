import type {
  VercelApiHandler,
  VercelRequest,
  VercelResponse,
} from '@vercel/node'
import axios from 'axios'
import { ProductResponse } from '../lib/types'

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
  console.log(req.body)

  const { data: productResponse } = await axios.get<ProductResponse>(
    `https://go-upc.com/api/v1/code/${req.body.code}?key=${process.env.GO_UPC_API_KEY}`,
  )

  const product = productResponse.product

  res.status(200).json({
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    brand: product.brand,
    specs: product.specs,
    category: product.category,
  })
}

export default handler
