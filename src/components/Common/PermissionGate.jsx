import { useApp } from "../../contexts/AppContext";

export const PermissionGate = ({ permission, children, fallback = null }) => {
  const { checkPermission } = useApp();

  if (!permission || checkPermission(permission)) {
    return children;
  }

  return fallback;
};

export default PermissionGate;
