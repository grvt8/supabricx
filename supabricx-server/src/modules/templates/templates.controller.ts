import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UseTemplateDto } from './dto/use-template.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll() {
    return this.templatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templatesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: RequestUser, @Body() body: CreateTemplateDto) {
    return this.templatesService.create(user.id, body.diagramId, {
      name: body.name,
      description: body.description,
    });
  }

  @Post(':id/use')
  @UseGuards(JwtAuthGuard)
  useTemplate(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: UseTemplateDto,
  ) {
    return this.templatesService.useTemplate(user.id, id, {
      name: body.name,
    });
  }
}
