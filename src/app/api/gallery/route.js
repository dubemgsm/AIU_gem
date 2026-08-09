import { readDb, writeDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

// GET: Fetch photos for a specific branch
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');

    if (!branch) {
      return NextResponse.json({ success: false, error: 'Branch parameter is required' }, { status: 400 });
    }

    const db = readDb();
    const photos = db.galleries.filter(
      (photo) => photo.branch_id.toLowerCase() === branch.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ success: false, error: 'Server error processing request' }, { status: 500 });
  }
}

// POST: Add new photo to a branch with security clearance checks
export async function POST(req) {
  try {
    const { title, imageUrl, description, category, branch_id, user } = await req.json();

    // 1. Authentication Check
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { role, branch: assigned_branch } = user;
    const targetBranch = (branch_id || '').toLowerCase();

    // 2. RBAC Access Authorization Rules
    let isAuthorized = false;

    if (role === 'super_admin') {
      isAuthorized = true; // Super Admin can post to any gallery scope
    } else if (role === 'branch_admin' || role === 'member') {
      // Branch Admin or Local Member can upload, but ONLY to their designated regional gallery
      if (assigned_branch.toLowerCase() === targetBranch) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Forbidden. As a ${assigned_branch || 'member'} (${role}), you do not have permission to upload photos to the ${targetBranch.toUpperCase()} gallery.` 
        }, 
        { status: 403 }
      );
    }

    if (!title || !description) {
      return NextResponse.json({ success: false, message: 'Title and description are required' }, { status: 400 });
    }

    const db = readDb();

    const defaultImg = category === 'portrait'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop';

    const newPhoto = {
      id: `u-${Date.now()}`,
      title,
      imageUrl: imageUrl || defaultImg,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      uploader: user.name,
      description,
      category: category || 'portrait',
      branch_id: targetBranch
    };

    db.galleries.unshift(newPhoto);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Photo successfully published to member archives!',
      data: newPhoto
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ success: false, message: 'Server error saving photo upload' }, { status: 500 });
  }
}
