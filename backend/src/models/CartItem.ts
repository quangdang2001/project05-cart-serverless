export interface CartItem {
  userId: string
  cartId: string
  createdAt: string
  name: string
  attachmentUrl?: string

  description: string
  price: number
  quantity: number
}
