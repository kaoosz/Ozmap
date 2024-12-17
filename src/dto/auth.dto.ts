export interface LoginDto {
  email: string;
  password: string;
}

export interface JwtPayloadDto {
  id: string;
  email: string;
}
