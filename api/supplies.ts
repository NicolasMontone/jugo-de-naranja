import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node"
import axios from "axios"
import { supabase } from "lib/supabase"
import { ProductResponse } from "lib/types"

const handler: VercelApiHandler = async (
  req: VercelRequest,
  res: VercelResponse,
) => {
	if (req.method === 'GET') {

		const { data } = await supabase.from('supplies').select('*')

		res.status(200).json(data)

		return
	}
	if(	req.method === 'POST'){
		const { barcode, amount } = req.body


    const { data: productResponse } = await axios.get<ProductResponse>(
      `https://go-upc.com/api/v1/code/${barcode}?key=${process.env.GO_UPC_API_KEY}`,
    )

    const {name, imageUrl, category, brand} = productResponse.product

		const { data, error } = await supabase.from('product').insert([
			{ barcode, name, img_url: imageUrl, category, brand }
		])

		  await supabase.from('supplies').insert([
			{ product_barcode: barcode, amount, product_name: name, product_img_url: imageUrl, product_category: category, product_brand: brand }
		])

		res.status(200).json({ data, error })

		return
	}

}

export default handler