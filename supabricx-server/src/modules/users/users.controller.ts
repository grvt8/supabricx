import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  CurrentUser,
  RequestUser,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, {
      name: body.name,
      bio: body.bio,
    });
  }

  @Get('credits')
  @UseGuards(JwtAuthGuard)
  getCredits(@CurrentUser() user: RequestUser) {
    return this.usersService.getCredits(user.id);
  }
}
