export interface CreateUserDto {
  name: string;
  email: string;
  address: string;
  coordinates?: [number, number];
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  address?: string;
  coordinates?: [number, number];
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  address?: string;
  coordinates?: [number, number];
  created_at?: Date;
  updated_at?: Date;
  updated_by?: string;
}
