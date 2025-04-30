import { Controller, Post, Body, Inject} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { NATS_SERVICE } from "src/common/enums/service.enums";
import { ClientProxy } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { RpcException } from "@nestjs/microservices";


@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(NATS_SERVICE.NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto) {
    console.log('Data received:', createProjectDto);
    return this.client.send('projects.create', createProjectDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}