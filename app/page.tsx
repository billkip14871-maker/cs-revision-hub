'use client'
import Link from 'next/link'
import {useEffect,useState} from 'react'

export default function Home(){
 const[q,setQ]=useState(''),[courses,setCourses]=useState<any[]>([]),[ai,setAi]=useState<any>(null),[busy,setBusy]=useState(false)
 useEffect(()=>{fetch('/api/search?q=').then(r=>r.json()).then(x=>setCourses(x.courses||[]))},[])
 async function ask(){
  if(!q.trim())return
  setBusy(true)
  const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q})})
  setAi(await r.json());setBusy(false)
 }
 return <>
 <header><nav className="container nav"><b>💻 CS Revision Hub</b><div><Link href="/search">Explore</Link> &nbsp; <Link href="/login">Sign in</Link></div></nav>
 <section className="container hero"><span className="badge">V16 · RAG · SEO READY</span>
 <h1>Master Computer Science from first semester to final year.</h1>
 <p>Study university-aligned topics, revision notes, questions, quizzes and videos — with an AI tutor that can ground answers in verified material.</p>
 <div className="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask: What is normalization in databases?"/><button className="primary" onClick={ask}>{busy?'Thinking…':'Ask AI'}</button></div>
 </section></header>
 <main className="container">
 {ai&&<section className="panel"><h2>🤖 AI Tutor</h2><p>{ai.answer}</p>{ai.sources?.length>0&&<><h4>Sources used</h4>{ai.sources.map((s:any)=><div className="source" key={s.id}>• {s.title} {s.official_source_url&&<a href={s.official_source_url} target="_blank">Official source</a>}</div>)}</>}{!ai.grounded&&<p className="muted">No verified-note context was found; the response is a general CS explanation.</p>}</section>}
 <section><h2>Study by stage</h2><div className="grid">
 <Link className="card" href="/search?q=programming"><h3>Year 1</h3><p>Programming, mathematics, fundamentals, data structures.</p></Link>
 <Link className="card" href="/search?q=database"><h3>Year 2</h3><p>Databases, operating systems, networks, software engineering.</p></Link>
 <Link className="card" href="/search?q=artificial intelligence"><h3>Years 3–4</h3><p>AI, security, cloud, distributed systems, projects and specialization.</p></Link>
 </div></section>
 <section><h2>University coverage</h2><div className="grid">{courses.map((c:any)=><Link className="card" href={'/course/'+c.slug} key={c.id}><span className="badge">{c.university}</span><h3>{c.code} — {c.title}</h3><p className="muted">Year {c.year_no} · Semester {c.semester_no}</p></Link>)}</div></section>
 </main><footer><div className="container">CS Revision Hub · Built for learning, review and responsible academic sourcing.</div></footer>
 </>
}
