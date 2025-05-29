import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { catchError, firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from '../common/nats.interface';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Get('load-channels')
  async getAllChannels(@Query('team_id') team_id: string) {
    console.log(team_id);
    const result = await firstValueFrom(
      this.client.send('channel.load.channels', team_id).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @Get('load-messages/:channel_id')
  async getMessages(@Param('channel_id') channel_id: string) {
    const result = await firstValueFrom(
      this.client.send('channel.load.messages', channel_id).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @Post('create-child-channel')
  async createChild(@Body() channel: CreateChannelDto) {
    const result = await firstValueFrom(
      this.client.send('channel.create.child.channel', channel).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }

  @Post('create-channel')
  async createChannel(@Body() channel: CreateChannelDto) {
    const result = await firstValueFrom(
      this.client.send('channel.create.channel', channel).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    );
    return result;
  }
}
