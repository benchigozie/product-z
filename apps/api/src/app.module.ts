import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma.module.js';
import { PropertyModule } from './property/property.module.js';
import { PlaceModule } from './place/place.module.js';
import { CountryModule } from './country/country.module.js';
import { StateModule } from './state/state.module.js';
import { PropertyRelationshipModule } from './property-relationship/property-relationship.module.js';
import { AuthModule } from './auth/auth.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    PropertyModule,
    PlaceModule,
    CountryModule,
    StateModule,
    PropertyRelationshipModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
