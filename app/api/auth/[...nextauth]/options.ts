import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
export const authOptions:NextAuthOptions = {
    session:{
      strategy:'jwt'
    },
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
      
    ],
    secret:process.env.NEXTAUTH_SECRET
}
  