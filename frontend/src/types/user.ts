export interface UserSizes {
  footwear?: string;
  gloves?: string;
  pants?: {
    letter?: string;
    number?: string;
  };
  shirtJacket?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  rol?: string;
  confirmed?: boolean;
  disabled?: boolean;
  company?: string;
  area?: string;
  costCenter?: string;
  position?: string; // ObjectId como string
  bosses?: string[]; // Array de ObjectIds como strings
  token?: string;
  rut?: number;
  sizes?: UserSizes;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
