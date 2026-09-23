import{NextResponse}from'next/server';import OpenAI from'openai';import{createClient}from'@supabase/supabase-js'
export async function POST(req:Request){try{const{question}=await req.json();if(!question)return NextResponse.json({error:'Question required'},{status:400})
if(!process.env.OPENAI_API_KEY)return NextResponse.json({answer:'AI is not connected. Add OPENAI_API_KEY to the server environment.',grounded:false,sources:[]})
const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY}),s=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!)
const e=await ai.embeddings.create({model:'text-embedding-3-small',input:question})
const{data:sources}=await s.rpc('match_verified_notes',{query_embedding:e.data[0].embedding,match_count:6})
const ctx=(sources||[]).map((x:any,i:number)=>`SOURCE ${i+1}: ${x.title}\n${x.body}\nURL: ${x.official_source_url||'none'}`).join('\n\n')
const prompt=ctx?`You are the CS Revision Hub tutor. Use the retrieved sources for source-grounded claims. Clearly distinguish general CS knowledge from university-specific claims. Cite retrieved evidence as [Source 1], etc. Do not invent citations.\n\n${ctx}\n\nQuestion: ${question}`:`You are the CS Revision Hub tutor. Answer this Computer Science question clearly, but explicitly say that no verified CS Hub source was retrieved. Question: ${question}`
const r=await ai.responses.create({model:'gpt-5-mini',input:prompt})
return NextResponse.json({answer:r.output_text,grounded:!!sources?.length,sources:sources||[]})
}catch(e:any){return NextResponse.json({error:e.message},{status:500})}}
