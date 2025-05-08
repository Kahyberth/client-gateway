import { Controller, Get, Post, Body, Param, Inject, Delete, ParseUUIDPipe, Put } from "@nestjs/common";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueDto } from "./dto/update-issue.dto";
import { NATS_SERVICE } from "src/common/enums/service.enums";
import { ClientProxy } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { RpcException } from "@nestjs/microservices";

@Controller('issues')
export class IssuesController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.client.send('issue.create', createIssueDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('issue.find.one', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Put('update')
  async update(@Body() updateIssueDto: UpdateIssueDto) {
    return this.client.send('issue.update', updateIssueDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('issue.remove', id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('user/:userId')
  async findByAssignedUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.client.send('issues.by.user', userId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('backlog/:backlogId')
  async findByBacklog(@Param('backlogId', ParseUUIDPipe) backlogId: string) {
    return this.client.send('issues.by.backlog', backlogId).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}