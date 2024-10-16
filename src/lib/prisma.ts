import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development mode, we want to use a singleton to avoid hot reloading issues
  //@ts-ignore
  if (!global.prisma) {
    //@ts-ignore
    global.prisma = new PrismaClient();
  }
  //@ts-ignore
  prisma = global.prisma;
}

export default prisma;
