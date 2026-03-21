import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateDiagramDto, UpdateDiagramDto } from './dto';
import { DiagramsService } from './diagrams.service';

@Controller('diagrams')
@UseGuards(JwtAuthGuard)
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() body: CreateDiagramDto) {
    return this.diagramsService.create(user.id, body);
  }

  @Get()
  findAll(
    @CurrentUser() user: RequestUser,
    @Query('public') isPublic?: string,
    @Query('template') isTemplate?: string,
  ) {
    const filters = {
      public: isPublic === 'true',
      template:
        isTemplate === 'true'
          ? true
          : isTemplate === 'false'
            ? false
            : undefined,
    };
    return this.diagramsService.findAll(user.id, filters);
  }

  @Get(':id')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.diagramsService.findOne(id, user.id);
  }

  @Put(':id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: UpdateDiagramDto,
  ) {
    return this.diagramsService.update(id, user.id, body);
  }

  @Delete(':id')
  delete(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.diagramsService.delete(id, user.id);
  }

  @Post(':id/versions')
  createVersion(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: { message?: string },
  ) {
    return this.diagramsService.createVersion(id, user.id, body.message);
  }

  @Post(':id/versions/:vid/restore')
  restoreVersion(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('vid') vid: string,
  ) {
    return this.diagramsService.restoreVersion(id, vid, user.id);
  }
}
