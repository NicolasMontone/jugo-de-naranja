export type ProductResponse = {
  code: string
  codeType: string
  product: Product
  barcodeUrl: string
}

export type Product = {
  name: string
  description: string
  imageUrl: string
  brand: string
  specs: any[]
  category: string
}
