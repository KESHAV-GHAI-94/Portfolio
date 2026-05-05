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
    const { title, slug, content, tags, published, imageUrl } = body;
    
    const { id: rawId } = await params; const id = parseInt(rawId);

    const post = await prisma.blogPost.update({
      where: { id },
      data: { 
        title, 
        slug, 
        content,
        imageUrl,
        tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()),
        published: Boolean(published)
      }
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
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
    await prisma.blogPost.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
