/* eslint-disable prettier/prettier */
// Here you probably want to add abstractions of libraries or utilities

// for example if you were using Sanity as your CMS you might want to add:
// sanity.ts -> methods to interact with Sanity CMS
import { getDateCompare } from './date';
import { createJwtToken, tokenVerify } from './jwtToken';
import { prisma } from './prismaDB';
import { displayNumbers } from './utils';

export {
    createJwtToken,
    tokenVerify,
    displayNumbers,
    getDateCompare,
    prisma,
};
