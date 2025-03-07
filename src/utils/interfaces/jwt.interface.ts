import { UserRoles } from "../../features/users/utils/user.enum";

export interface IJWTData {
  id: string;
  role: UserRoles;
  shop_id: string | null;
}
