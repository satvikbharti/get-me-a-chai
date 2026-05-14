import NextAuth from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
// import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google"
import mongoose from "mongoose";
import connectDb from '@/db/connectDb';
import User from '@/models/User';
import Payment from '@/models/Payment';


export const authoptions = NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "github" || account.provider === "google") {
        await connectDb()
        // Check if the user already exists in the database
        const currentUser = await User.findOne({ email: email })
        if (!currentUser) {
          // Create a new user
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          })
        }
        return true
      }
    },

    async session({ session, user, token }) {
      const dbUser = await User.findOne({ email: session.user.email })
      session.user.name = dbUser.username
      return session
    },
  }
})

export { authoptions as GET, authoptions as POST }