import './globals.css'
import type { Metadata } from 'next'
export const metadata:Metadata={
 title:'CS Revision Hub | Computer Science Notes, Quizzes & AI Tutor',
 description:'A Computer Science learning hub with university-aligned notes, questions, quizzes, videos and an AI tutor.',
 keywords:['computer science notes','Kenya university computer science','programming notes','data structures','AI tutor']
}
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body>{children}</body></html>
}
