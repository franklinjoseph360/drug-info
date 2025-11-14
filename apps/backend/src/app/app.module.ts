import { Module } from '@nestjs/common';
import { DrugsModule } from './drugs/drugs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DrugsModule],
})
export class AppModule {}
