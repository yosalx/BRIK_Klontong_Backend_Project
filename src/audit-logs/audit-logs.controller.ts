import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogService: AuditLogsService) {}

  @Get()
  async findAll(@Query() queryAuditLogDto: QueryAuditLogDto) {
    const { page, limit, entityName, action, startDate, endDate } =
      queryAuditLogDto;
    return this.auditLogService.findAll(
      page,
      limit,
      entityName,
      action,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditLogService.findOne(id);
  }
}
