import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try{
      await this.$connect();
    }catch (error) {
      console.error('Error connecting to the database:', error);
      throw error; // Rethrow the error to ensure the application does not start if the connection fails
    }
    // Optionally, you can log a message or perform additional setup here
    console.log('Prisma Client connected to the database.');
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma Client disconnected.');
  }
}