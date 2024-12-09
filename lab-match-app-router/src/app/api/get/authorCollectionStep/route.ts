import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    // Extract the queue ID from the query parameters
    const { searchParams } = new URL(request.url);
    const queueId = parseInt(searchParams.get('queueId') || '');

    if (isNaN(queueId)) {
      return NextResponse.json({ error: 'Invalid queue ID' }, { status: 400 });
    }

    // Retrieve the step from the queue table
    const queueEntry = await prisma.lu_collect_author_data_queue.findUnique({
      where: { queue_id: queueId },
      select: { step: true }, // Only select the step field
    });

    if (!queueEntry) {
      return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
    }

    // Return the step value
    return NextResponse.json({ step: queueEntry.step });
  } catch (error) {
    console.error('Error fetching step:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
