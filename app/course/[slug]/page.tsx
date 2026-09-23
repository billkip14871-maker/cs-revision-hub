import Link from'next/link'
export default async function Course({params}:{params:{slug:string}}){
 const base=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'
 const r=await fetch(base+'/api/search?course='+encodeURIComponent(params.slug),{cache:'no-store'});const d=await r.json()
 return <main className="container"><Link href="/">← Home</Link><div className="panel"><span className="badge">COURSE</span><h1>{d.course?.code} — {d.course?.title}</h1><p>{d.course?.description||'University-aligned Computer Science course.'}</p><button onClick={()=>navigator.share?.({title:d.course?.title,url:location.href})}>Share this course</button></div><h2>Verified notes</h2>{(d.notes||[]).map((n:any)=><article className="card" key={n.id}><h3>{n.title}</h3><p>{n.body}</p>{n.official_source_url&&<p className="source">Source: <a href={n.official_source_url}>{n.official_source_url}</a></p>}</article>)}</main>
}
