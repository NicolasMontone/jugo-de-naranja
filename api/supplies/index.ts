import { VercelApiHandler, VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import { ProductResponse } from '../_lib/types'

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL || '',
  process.env.SUPABASE_API_KEY || '',
)

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method === 'GET') {
    const { data } = await supabase.from('supplies').select('*')

    res.status(200).json(data)

    return
  }

  if (req.method === 'POST') {
    const { barcode, amount } = req.body

    const { data: productResponse } = await axios.get<ProductResponse>(
      `https://go-upc.com/api/v1/code/${barcode}?key=${process.env.GO_UPC_API_KEY}`,
    )

    const { name, imageUrl, category, brand } = productResponse.product

    await supabase
      .from('products')
      .insert({ barcode, name, img_url: imageUrl, category, brand })

    await supabase.from('supplies').insert([
      {
        product_barcode: barcode,
        amount,
        product_name: name,
        product_img_url: imageUrl,
        product_category: category,
        product_brand: brand,
      },
    ])

    res.status(200).json('OK')

    return
  }
}

export default handler
