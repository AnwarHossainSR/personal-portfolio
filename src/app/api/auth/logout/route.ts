/* eslint-disable no-console */
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('req', req);
  const res = await req.json();
  console.log('res', res);
  return NextResponse.json({ message: 'Hello World' });
}
