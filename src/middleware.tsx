import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { tokenVerify } from '@/lib';

import { SITE_URL } from './env';

export default async function middleware(req: NextRequest) {
  const accessToken = cookies().get('token');

  if (!accessToken) return NextResponse.redirect(new URL('/', req.url), req);
  const authUser = await tokenVerify(accessToken?.value);
  if (!authUser) return NextResponse.redirect(new URL('/', req.url), req);
  let user: any = null;
  try {
    const response = await fetch(`${SITE_URL}/api/user/${authUser?.userId}`);
    if (!response.ok) {
      console.log('error >>', response);
      return NextResponse.redirect(new URL('/', req.url), req);
    }
    user = await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error >>', error);
    return NextResponse.redirect(new URL('/', req.url), req);
  }

  if (!user) return NextResponse.redirect(new URL('/', req.url), req);

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard', '/admin/:path*'],
};
