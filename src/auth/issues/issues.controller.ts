import { Controller, Get, Post, Body, Param, Inject, InternalServerErrorException } from "@nestjs/common";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { NATS_SERVICE } from "src/common/enums/service.enums";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, firstValueFrom } from "rxjs";
import { RpcException } from "@nestjs/microservices";

@Controller('issues')
export class IssuesController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createIssueDto: CreateIssueDto) {
    console.log(createIssueDto)
    const result = await firstValueFrom(
      this.client.send('issue.create', createIssueDto).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Get()
  async findAll() {
    const result = await firstValueFrom(
      this.client.send('issue.find.all', {}).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.client.send('issue.find.one', id).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Post(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto
  ) {
    const result = await firstValueFrom(
      this.client.send('issue.update', { id, updateDto: updateIssueDto }).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Post(':id/remove')
  async remove(@Param('id') id: string) {
    const result = await firstValueFrom(
      this.client.send('issue.remove', id).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Get('user/:userId')
  async findByAssignedUser(@Param('userId') userId: string) {
    const result = await firstValueFrom(
      this.client.send('issues.by.user', userId).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }

  @Get('backlog/:backlogId')
  async findByBacklog(@Param('backlogId') backlogId: string) {
    const result = await firstValueFrom(
      this.client.send('issues.by.backlog', backlogId).pipe(
        catchError(err => { throw new RpcException(err); })
      )
    );
    return result;
  }
}