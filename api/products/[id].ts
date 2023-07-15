import type {
  VercelApiHandler,
  VercelRequest,
  VercelResponse,
} from '@vercel/node'
import axios from 'axios'
import { ProductResponse } from '../_lib/types'

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const code = req.query.id as string
  try {
    const { data: productResponse } = await axios.get<ProductResponse>(
      `https://go-upc.com/api/v1/code/${code}?key=${process.env.GO_UPC_API_KEY}`,
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
    return
  } catch (error: any) {
    if (error.response?.status === 400) {
      res.status(400).json({ error: 'Invalid code' })
      return
    }

    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
  }
}

export default handler
