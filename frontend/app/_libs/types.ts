export type Account = {
  username: string,
  password: string,
  rePassword: string,
  email: string,
  github: string,
  studentCode: string,
  fullName: string,
  gender: string,
  phone: string,
  major: string,
  birthday: Date,
  profileImg: string | null,
  currentTerm: number,
  fundStatus: boolean,
  isActive: boolean
}

export type Profile = {
  id: number,
  role: string,
  email: string,
  github: string,
  studentCode: string,
  fullName: string,
  gender: string,
  phone: string,
  major: string,
  birthday: string,
  profileImg: string | null,
  currentTerm: number,
  fundStatus: boolean,
  createdDate: Date,
  updatedDate: Date,
  lastLogin: Date,
  active: boolean
}
