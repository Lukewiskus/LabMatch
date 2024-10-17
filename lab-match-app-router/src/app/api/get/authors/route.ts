// app/api/authors/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  console.log(query)
  if (!query) {
    return NextResponse.json({ error: 'No query provided' }, { status: 400 });
  }

  const authors = await prisma.lu_author.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive', 
      },
    },
    take: 20,
  });
  return NextResponse.json(authors);
}
