/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
// global.d.ts
declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
}

export { };
