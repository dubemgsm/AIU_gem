import { readDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const db = readDb();
    const matchedUser = db.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      const sessionUser = {
        id: matchedUser.id,
        username: matchedUser.username,
        name: matchedUser.name,
        role: matchedUser.role,
        branch: matchedUser.assigned_branch
      };
      
      return NextResponse.json({ success: true, user: sessionUser });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, error: 'Server error processing request' }, { status: 500 });
  }
}
