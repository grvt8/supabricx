import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsService } from './comments.service';

@Controller('diagrams/:diagramId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(
    @CurrentUser() user: RequestUser,
    @Param('diagramId') diagramId: string,
  ) {
    return this.commentsService.findAll(diagramId, user.id);
  }

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Param('diagramId') diagramId: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentsService.create(diagramId, user.id, body);
  }

  @Put(':commentId/resolve')
  resolve(
    @CurrentUser() user: RequestUser,
    @Param('diagramId') diagramId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.resolve(diagramId, commentId, user.id);
  }
}
