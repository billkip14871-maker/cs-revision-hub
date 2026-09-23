create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists universities(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 country text not null,
 official_url text,
 slug text unique not null
);

create table if not exists courses(
 id uuid primary key default gen_random_uuid(),
 university_id uuid references universities(id) on delete set null,
 code text not null,
 title text not null,
 slug text unique not null,
 year_no int,
 semester_no int,
 description text,
 created_at timestamptz default now()
);

create table if not exists notes(
 id uuid primary key default gen_random_uuid(),
 course_id uuid references courses(id) on delete cascade,
 title text not null,
 slug text not null,
 body text not null,
 status text not null default 'draft'
   check(status in ('draft','reviewed','verified')),
 official_source_url text,
 curriculum_version text,
 reviewer text,
 rights_check boolean default false,
 embedding vector(1536),
 created_at timestamptz default now(),
 unique(course_id,slug)
);

create table if not exists questions(
 id uuid primary key default gen_random_uuid(),
 course_id uuid references courses(id) on delete cascade,
 question text not null,
 answer text not null,
 difficulty text default 'medium',
 status text default 'reviewed'
);

create table if not exists videos(
 id uuid primary key default gen_random_uuid(),
 course_id uuid references courses(id) on delete cascade,
 title text not null,
 youtube_id text not null,
 description text
);

create table if not exists quizzes(
 id uuid primary key default gen_random_uuid(),
 course_id uuid references courses(id) on delete cascade,
 title text not null
);

create table if not exists quiz_questions(
 id uuid primary key default gen_random_uuid(),
 quiz_id uuid references quizzes(id) on delete cascade,
 question text not null,
 options jsonb not null,
 correct_option int not null,
 explanation text
);

create table if not exists progress(
 user_id uuid references auth.users(id) on delete cascade,
 note_id uuid references notes(id) on delete cascade,
 completed boolean default false,
 updated_at timestamptz default now(),
 primary key(user_id,note_id)
);

create table if not exists bookmarks(
 user_id uuid references auth.users(id) on delete cascade,
 note_id uuid references notes(id) on delete cascade,
 created_at timestamptz default now(),
 primary key(user_id,note_id)
);

alter table notes enable row level security;
alter table questions enable row level security;
alter table videos enable row level security;
alter table courses enable row level security;
alter table universities enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table progress enable row level security;
alter table bookmarks enable row level security;

create policy "public verified notes" on notes for select using(status='verified');
create policy "public reviewed questions" on questions for select using(status in ('reviewed','verified'));
create policy "public videos" on videos for select using(true);
create policy "public courses" on courses for select using(true);
create policy "public universities" on universities for select using(true);
create policy "public quizzes" on quizzes for select using(true);
create policy "public quiz questions" on quiz_questions for select using(true);
create policy "own progress" on progress for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "own bookmarks" on bookmarks for all using(auth.uid()=user_id) with check(auth.uid()=user_id);

create or replace function match_verified_notes(query_embedding vector(1536), match_count int default 5)
returns table(id uuid,title text,body text,official_source_url text,course_id uuid,similarity float)
language sql stable as $$
select n.id,n.title,n.body,n.official_source_url,n.course_id,
1-(n.embedding <=> query_embedding) similarity
from notes n
where n.status='verified' and n.embedding is not null
order by n.embedding <=> query_embedding
limit match_count;
$$;

insert into universities(name,country,official_url,slug) values
('University of Nairobi','Kenya','https://computerscience.uonbi.ac.ke/admission-content-type/bachelor-science-computer-science','uon'),
('Kenyatta University','Kenya','https://www.ku.ac.ke/course/bachelor-of-science-computer-science','ku')
on conflict(slug) do nothing;
