import { SidebarItem, SidebarItemLogout } from "./SidebarItem";
import { PRIVATE_ROUTES } from "@/constants/routes";
import { Role } from "@/models/user.model";
import { useSidebar } from "@/stores/sidebar.store";
import {
  LogOut,
  User,
  UserCog,
} from "lucide-react";

interface SidebarContentProps {
  isMobile?: boolean;
}

export const SidebarContent = ({ isMobile }: SidebarContentProps) => {
  const isOpen = useSidebar((state) => state.isOpen);
  const isSidebarOpen = !isMobile ? isOpen : true;

  return (
    <>
      <SidebarItem
        label="Perfil"
        to={PRIVATE_ROUTES.PROFILE}
        isSidebarOpen={isSidebarOpen}
        isIndexRoute
      >
        <UserCog size={24} />
      </SidebarItem>

      <SidebarItem
        label="Usuarios"
        to={PRIVATE_ROUTES.USERS}
        isSidebarOpen={isSidebarOpen}
        allowedRoles={[Role.ADMIN]}
      >
        <User size={24} />
      </SidebarItem>

      <SidebarItemLogout label="Cerrar sesión" isSidebarOpen={isSidebarOpen}>
        <LogOut size={24} />
      </SidebarItemLogout>
    </>
  );
};
