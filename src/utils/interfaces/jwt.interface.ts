import { UserRoles } from "../../features/users/utils/user.enum";

export interface IJWTData {
  id: string;
  role: UserRoles;
}
