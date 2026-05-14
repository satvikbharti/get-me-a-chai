import React from "react"
import PaymentPage from "@/components/PaymentPage"
import { notFound } from "next/navigation"
import connectDb from "@/db/connectDb"
import User from "@/models/User"

const Username = async ({ params }) => {
  // ✅ await params FIRST
  const { username } = await params

  // ✅ check user
  await connectDb()
  const user = await User.findOne({ username })

  if (!user) {
    return notFound()
  }

  return (
    <>
      {/* ✅ use resolved username */}
      <PaymentPage username={username} />
    </>
  )
}

export default Username

// ✅ Metadata is already correct
export async function generateMetadata({ params }) {
  const { username } = await params

  return {
    title: `${username} | Get Me A Chai`,
  }
}
