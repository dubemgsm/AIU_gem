import { readDb, writeDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(req) {
  try {
    const { username, password, name, branch } = await req.json();

    if (!username || !password || !name || !branch) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const db = readDb();
    const exists = db.users.some((u) => u.username.toLowerCase() === username.toLowerCase());

    if (exists) {
      return NextResponse.json({ success: false, error: 'Username already taken' }, { status: 400 });
    }

    const newUser = {
      id: Date.now(),
      username: username.toLowerCase(),
      password,
      name,
      role: 'member', // Default to member role
      assigned_branch: branch
    };

    db.users.push(newUser);
    writeDb(db);

    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
      branch: newUser.assigned_branch
    };

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ success: false, error: 'Server error processing request' }, { status: 500 });
  }
}
