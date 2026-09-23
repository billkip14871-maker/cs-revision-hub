import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const q = params.get("q") || "";
  const course = params.get("course");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  if (course) {
    const { data: courseData, error: courseError } =
      await supabase
        .from("courses")
        .select("*")
        .eq("slug", course)
        .single();

    if (courseError || !courseData) {
      return NextResponse.json({
        course: null,
        notes: [],
      });
    }

    const { data: notes, error: notesError } =
      await supabase
        .from("notes")
        .select("id,title,body,official_source_url")
        .eq("course_id", courseData.id)
        .eq("status", "verified");

    if (notesError) {
      return NextResponse.json(
        { error: notesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      course: courseData,
      notes: notes || [],
    });
  }

  const { data: courses, error: coursesError } =
    await supabase
      .from("courses")
      .select(
        "id,code,title,slug,year_no,semester_no,description,universities(name)"
      )
      .limit(100);

  if (coursesError) {
    return NextResponse.json(
      { error: coursesError.message },
      { status: 500 }
    );
  }

  let notes: any[] = [];

  if (q) {
    const { data: searchNotes, error: notesError } =
      await supabase
        .from("notes")
        .select("id,title,body,official_source_url")
        .eq("status", "verified")
        .or(`title.ilike.%${q}%,body.ilike.%${q}%`)
        .limit(30);

    if (notesError) {
      return NextResponse.json(
        { error: notesError.message },
        { status: 500 }
      );
    }

    notes = searchNotes || [];
  }

  return NextResponse.json({
    courses: (courses || []).map((item: any) => ({
      ...item,
      university: item.universities?.name || "Global",
    })),
    notes,
  });
}
