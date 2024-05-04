'use server';

import { cookies } from 'next/headers';

export const getAuthenticatedUser = async () => {
  const user = cookies().get('user');

  if (!user) return null;

  const parsedUser = JSON.parse(user.value);

  return parsedUser;
};
