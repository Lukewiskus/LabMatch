import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Named export for handling the POST method
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    // Validate the input
    if (!name || typeof name !== 'string' || name.length > 255) {
      return NextResponse.json({ error: 'Invalid or missing name.' }, { status: 400 });
    }

    // Insert data into the database
    const newEntry = await prisma.lu_collect_author_data_queue.create({
      data: {
        name,
        create_date_utc: new Date(),
        step:0,
        author_id: null,
      },
    });

    // Return the generated queue_id
    return NextResponse.json({ queue_id: newEntry.queue_id }, { status: 201 });
  } catch (error) {
    console.error('Error inserting into the queue:', error);
    return NextResponse.json({ error: 'Failed to insert into the queue.' }, { status: 500 });
  }
}
