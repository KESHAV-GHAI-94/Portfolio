import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/auth/config';
import prisma from '@/backend/db/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, icon, proficiency, category, sortOrder } = body;
    
    // Await params if Next.js 15+ is used, but Next.js 14 doesn't require awaiting params.
    // We'll safely parse the ID.
    const { id: rawId } = await params; const id = parseInt(rawId);

    const skill = await prisma.skill.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id: rawId } = await params; const id = parseInt(rawId);
    await prisma.skill.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
