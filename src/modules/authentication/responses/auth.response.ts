import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationResponse {
  @ApiProperty({
    description:
      'Token JWT utilizado para autenticar as requisições subsequentes à API.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3NTg0NjQwMDAsImV4cCI6MTc1ODQ2NzYwMH0.example-signature',
    type: String,
  })
  accessToken!: string;
}
