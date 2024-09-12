"use client"
import { useParams } from 'next/navigation'
import EditForm from '../components/EditForm'

export default function EditProductPage({params}: any) {
  const { productId } = params




  return (
    <div>
      <EditForm productId={productId} />
    </div>
  )
}
