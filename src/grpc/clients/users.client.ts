import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UsersService {
  findBySubscribedStation(data: {
    stationId: string;
  }): Observable<{
    users: {
      id: string;
      email: string;
      name: string;
    }[];
  }>;
}

@Injectable()
export class UsersClient implements OnModuleInit {
  private usersService!: UsersService;

  constructor(
    @Inject('USERS_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UsersService>('UsersService');
  }

  findBySubscribedStation(stationId: string) {
    return this.usersService.findBySubscribedStation({ stationId });
  }
}