import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async createAuditLog(
    entityName: string,
    entityId: number,
    action: string,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      entityName,
      entityId,
      action,
      oldValues,
      newValues,
    });

    return await this.auditLogRepository.save(auditLog);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    entityName?: string,
    action?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<[AuditLog[], number]> {
    const query = this.auditLogRepository.createQueryBuilder('auditLog');

    if (entityName) {
      query.andWhere('auditLog.entityName = :entityName', { entityName });
    }

    if (action) {
      query.andWhere('auditLog.action = :action', { action });
    }

    if (startDate && endDate) {
      query.andWhere('auditLog.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    query
      .orderBy('auditLog.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return await query.getManyAndCount();
  }

  async findOne(id: number): Promise<AuditLog> {
    return await this.auditLogRepository.findOne({ where: { id } });
  }
}
