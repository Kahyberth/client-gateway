import {
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/common/enums/service.enums';
import { CreateIssueDto } from './dto/create-issue.dto';

@Controller('backlog')
export class BacklogController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('add-issue/:id')
  async addIssueToBacklog(
    @Body() createIssueDto: CreateIssueDto,
    @Param('id') productBacklogId: string,
  ) {
    return this.client
      .send('product-backlog.addIssueToBacklog', {
        createIssueDto,
        productBacklogId,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        }),
      );
  }
}
