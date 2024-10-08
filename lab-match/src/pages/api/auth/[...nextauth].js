import { callback } from "chart.js/dist/helpers/helpers.core"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callback: {
    async signIn({ account, profile}) {
        console.log(account)
        console.log(profile)
        return true
    }
  }
}

export default NextAuth(authOptions)