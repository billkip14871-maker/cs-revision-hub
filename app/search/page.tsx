'use client'
import{useEffect,useState}from'react'
import Link from'next/link'
export default function Search(){const[q,setQ]=useState(''),[data,setData]=useState<any[]>([])
async function run(v=q){setQ(v);let r=await fetch('/api/search?q='+encodeURIComponent(v));let x=await r.json();setData(x.notes||[])}
useEffect(()=>{run('')},[])
return <main className="container"><Link href="/">← Home</Link><h1>Search the knowledge base</h1><div className="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search verified notes"/><button className="primary" onClick={()=>run()}>Search</button></div>{data.map(n=><article className="card" key={n.id}><h2>{n.title}</h2><p>{n.body.slice(0,350)}…</p>{n.official_source_url&&<p className="source"><a href={n.official_source_url} target="_blank">Official source ↗</a></p>}</article>)}</main>}
