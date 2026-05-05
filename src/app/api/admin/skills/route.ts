import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/auth/config';
import prisma from '@/backend/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const skills = await prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, icon, proficiency, category, sortOrder } = body;

    const skill = await prisma.skill.create({
      data: { 
        name, 
        icon, 
        proficiency: Number(proficiency), 
        category, 
        sortOrder: Number(sortOrder) || 0 
      }
    });

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
