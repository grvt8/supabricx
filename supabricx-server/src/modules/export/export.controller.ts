import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ExportCodeDto } from './dto/export-code.dto';
import { ExportDiagramDto } from './dto/export-diagram.dto';
import { ExportService } from './export.service';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('code')
  exportCode(@CurrentUser() user: RequestUser, @Body() body: ExportCodeDto) {
    return this.exportService.exportCode(user.id, body.diagramId, body.format);
  }

  @Post('diagram')
  exportDiagram(
    @CurrentUser() user: RequestUser,
    @Body() body: ExportDiagramDto,
  ) {
    return this.exportService.exportDiagram(
      user.id,
      body.diagramId,
      body.format,
      body.diagramUrl,
    );
  }

  @Get()
  listExports(
    @CurrentUser() user: RequestUser,
    @Query('diagramId') diagramId?: string,
  ) {
    return this.exportService.listExports(user.id, diagramId);
  }

  @Get(':id/download')
  getDownloadUrl(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.exportService.getDownloadUrl(user.id, id);
  }
}
