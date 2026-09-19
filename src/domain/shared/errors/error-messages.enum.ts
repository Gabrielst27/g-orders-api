export enum UnauthorizedMessage {
  INVALID_TOKEN = 'Token inválido',
  INVALID_CREDENTIALS = 'Credenciais inválidas',
  USER_NOT_AUTHENTICATED = 'Usuário não autenticado',
  TOKEN_EXPIRED = 'Token expirado',
}

export enum ForbiddenMessage {
  USER_HAVE_NOT_PERMISSION = 'Usuário sem permissão para esta ação',
}

export enum BadRequestMessage {
  INVALID_DATA = 'Dados inválidos',
}
