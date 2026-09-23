import{NextResponse}from'next/server';import{createClient}from'@supabase/supabase-js'
export async function GET(req:Request){const p=new URL(req.url).searchParams,q=p.get('q')||'',course=p.get('course');const s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
if(course){const{data:c}=await s.from('courses').select('*').eq('slug',course).single();if(!c)return NextResponse.json({course:null,notes:[]});const{data:n}=await s.from('notes').select('*').eq('course_id',c.id).eq('status','verified');return NextResponse.json({course:c,notes:n||[]})}
const{data:courses}=await s.from('courses').select('id,code,title,slug,year_no,semester_no,description,universities(name)').limit(100)
const{data:notes}=q?s.from('notes').select('id,title,body,official_source_url').eq('status','verified').or(`title.ilike.%${q}%,body.ilike.%${q}%`).limit(30):Promise.resolve({data:[]})
return NextResponse.json({courses:(courses||[]).map((x:any)=>({...x,university:x.universities?.name||'Global'})),notes:notes||[]})}
