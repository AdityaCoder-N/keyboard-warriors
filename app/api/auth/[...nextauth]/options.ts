import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import  CredentialsProvider  from "next-auth/providers/credentials";

import { NextAuthOptions } from "next-auth";
import dbConnect from "@/utils/dbConnect";
import UserModel from "@/models/UserModel";
import bcrypt from 'bcryptjs'

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
      }),
      CredentialsProvider({
        id:"credentials",
        name:"credentials",
        credentials:{
          email:{label:"Email",type:"text"},
          password:{label:"Password",type:"password"}
        },
        async authorize(credentials:any):Promise<any>{
          await dbConnect();

          try {

            // console.log(credentials);
            const user = await UserModel.findOne({email:credentials.email});

            if(!user){
              throw new Error("No user found with this email.");
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);

            if(isPasswordCorrect){
              return user;
            }else{
              throw new Error("Incorrect Password");
            }
            
          } catch (error:any) {
            console.log("Error Loggin In",error);
            throw new Error(error);
          }
        }
      })
    ],
    callbacks:{
      async jwt({ token, user }) {
        console.log("user found",user);
        if(user){
            token._id = user._id?.toString();
            token.username = user.username;
        }
        return token
      },
      async session({ session, user, token }) {

        if(token){
          session.user._id = token._id?.toString();
          session.user.username = token.username;
        }
        
        return session
      },
    },
    pages:{
      signIn:'/sign-in'
    },
    secret:process.env.NEXTAUTH_SECRET
}
  