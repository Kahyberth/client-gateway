import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';


@Controller('channels')
export class ChannelsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  

  @Get('load-channels')
  async getAllChannels(@Query('team_id') team_id: string  ) {
    console.log(team_id)
    const result = await firstValueFrom(
      this.client.send('channel.load.channels', team_id).pipe(
        catchError((err) => {
          throw new InternalServerErrorException(err);
        }),
      ),
    )
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
