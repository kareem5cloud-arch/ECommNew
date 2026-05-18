// Response Type
export interface userDatagetApiResponse {
  userData: userDataget[];
}

// A single userDataget record
export type userDataget = {
  email: string;
  phone: string;
  userName: string;
};
