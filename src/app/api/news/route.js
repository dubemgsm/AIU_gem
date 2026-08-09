import { readDb, writeDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

// GET: Fetch news articles (global news, or branch + global news)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');

    const db = readDb();
    let filteredNews = db.news;

    if (branch && branch !== 'all') {
      // Filter: target_branch = branch OR target_branch = 'global'
      filteredNews = filteredNews.filter(
        (item) => item.target_branch.toLowerCase() === branch.toLowerCase() || item.target_branch === 'global'
      );
    } else if (branch === 'all') {
      // Return everything
      filteredNews = db.news;
    } else {
      // Default: fetch global news only
      filteredNews = filteredNews.filter((item) => item.target_branch === 'global');
    }

    // Sort by published_at DESC (simulating SQL ORDER BY)
    filteredNews.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    return NextResponse.json({
      success: true,
      count: filteredNews.length,
      data: filteredNews
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ success: false, error: 'Server error processing request' }, { status: 500 });
  }
}

// POST: Create news article with RBAC middleware logic
export async function POST(req) {
  try {
    const { title, content, target_branch, image, tags, user } = await req.json();

    // 1. Authentication Check
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { role, branch: assigned_branch } = user;
    const targetBranch = (target_branch || '').toLowerCase();

    // 2. Authorization Checks (RBAC Rules)
    let isAuthorized = false;

    if (role === 'super_admin') {
      isAuthorized = true; // Rule 1: Super Admins can do anything anywhere
    } else if (role === 'branch_admin') {
      // Rule 2: Branch Admins can only publish to their assigned branch
      if (assigned_branch.toLowerCase() === targetBranch) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Forbidden. As a ${assigned_branch || 'member'} (${role}), you do not have permission to publish content to ${targetBranch || 'this scope'}.` 
        }, 
        { status: 403 }
      );
    }

    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required' }, { status: 400 });
    }

    const db = readDb();
    
    const newArticle = {
      id: Date.now(),
      title,
      content,
      image: image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
      published_at: new Date().toISOString(),
      target_branch: targetBranch,
      author: user.name,
      tags: tags || ['Announcement']
    };

    db.news.unshift(newArticle); // Prepend to top
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Announcement published successfully!',
      data: newArticle
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ success: false, message: 'Server error saving news article' }, { status: 500 });
  }
}
