export interface UserLoginType {
  email: string
  password: string
}

export interface UserType {
  email: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}
