import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');
    console.log("here")
  try {
    // Fetch the author data from the database using Prisma
    const author = await prisma.lu_author.findUnique({
      where: { author_id: id },
    });

    if (!author) {
      return NextResponse.json({ message: "Author not found" }, { status: 404 });
    }

    // Parse google_cites_per_year if it exists (it may be stored as a stringified JSON)
    const citationObj = author.google_cites_per_year ? JSON.parse(author.google_cites_per_year) : null;

    const result = {
      authorId: author.author_id,
      name: author.name,
      affiliation: author.affiliation,
      email: author.email,
      lab_id: author.lab_id,
      h_index: author.h_index,
      google_scholar_id: author.google_scholar_id,
      google_h_index: author.google_h_index,
      google_h_index5y: author.google_h_index5y,
      google_i_index: author.google_i_index,
      google_i_index5y: author.google_i_index5y,
      google_homepage: author.google_homepage,
      google_cites_per_year: citationObj,
      create_date_utc: author.create_date_utc.toISOString(),
      last_modified_date_utc: author.last_modified_date_utc ? author.last_modified_date_utc.toISOString() : null,
    };

    console.log(result)

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error while fetching data:", error);
    return NextResponse.json({ message: "Error while fetching data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
