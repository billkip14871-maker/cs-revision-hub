'use client'
import{useState}from'react'
import Link from'next/link'
import{supabaseBrowser}from'../../lib/supabase'
export default function Login(){const[email,setEmail]=useState(''),[msg,setMsg]=useState('')
async function go(){const{error}=await supabaseBrowser().auth.signInWithOtp({email,options:{emailRedirectTo:location.origin}});setMsg(error?.message||'Check your email for the sign-in link.')}
return <main className="container"><div className="panel"><h1>Student sign in</h1><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"/><button className="primary" onClick={go}>Send secure link</button><p>{msg}</p><Link href="/">← Home</Link></div></main>}
