import { PrismaClient } from '@prisma/client';

import secretKey from '@/env';

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = new PrismaClient();
if (secretKey.NODE_ENV !== 'production') globalThis.prisma = prisma;
