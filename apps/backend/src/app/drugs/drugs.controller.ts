import { Controller, Get, Query } from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { GetDrugsQueryDto } from './dto/get-drugs-query.dto';

@Controller('drugs')
export class DrugsController {
  constructor(private readonly service: DrugsService) { }

  // GET /api/table-config - simple route provided here for convenience
  @Get('/table-config')
  getTableConfig() {
    return this.service.getTableConfig();
  }

  // GET /api/drugs
  @Get()
  async findAll(@Query() query: GetDrugsQueryDto) {
    return this.service.findAll(query);
  }
}
