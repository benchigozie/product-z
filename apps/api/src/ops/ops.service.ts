import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma.service.js';
  import { PropertyRepository } from '../property/property.repository.js';
  
  @Injectable()
  export class OpsService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly propertyRepo: PropertyRepository,
    ) {}
  
    async mergeProperties(params: {
      sourceId: string;
      targetId: string;
      actorId: string;
      reason?: string;
    }) {
      const { sourceId, targetId } = params;
  
      if (sourceId === targetId) {
        throw new BadRequestException('Cannot merge a property into itself');
      }
  
      const source = await this.prisma.db.orm.public.Property
        .where({ id: sourceId })
        .first();
      const target = await this.prisma.db.orm.public.Property
        .where({ id: targetId })
        .first();
  
      if (!source) throw new NotFoundException('Source property not found');
      if (!target) throw new NotFoundException('Target property not found');
      if ((source as any).mergedIntoId) {
        throw new ConflictException('Source property is already merged');
      }
      if ((target as any).mergedIntoId) {
        throw new ConflictException('Target property is already merged');
      }
  
      return this.prisma.db.transaction(async (tx) => {
        const { mergeId } = await this.propertyRepo.mergePropertiesTx(tx, {
          sourceId,
          targetId,
          actorUserId: params.actorId,
          reason: params.reason,
        });
        return { mergeId };
      });
    }
  
    async reverseMerge(params: { mergeId: string; actorId: string }) {
      const merge = await this.prisma.db.orm.public.PropertyMerge
        .where({ id: params.mergeId })
        .first();
  
      if (!merge) throw new NotFoundException('Merge not found');
      if ((merge as any).reversedAt) {
        throw new ConflictException('Merge already reversed');
      }
  
      await this.prisma.db.transaction(async (tx) => {
        await this.propertyRepo.reverseMergeTx(tx, {
          mergeId: params.mergeId,
          actorUserId: params.actorId,
        });
      });
  
      return { success: true };
    }
  }