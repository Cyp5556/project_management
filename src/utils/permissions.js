export const ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

export const canEdit = (role) => {
  return [ROLES.OWNER, ROLES.ADMIN, ROLES.EDITOR].includes(role);
};

export const canDelete = (role) => {
  return [ROLES.OWNER, ROLES.ADMIN].includes(role);
};

export const canManage = (role) => {
  return [ROLES.OWNER, ROLES.ADMIN].includes(role);
};

export const canView = (role) => {
  return Object.values(ROLES).includes(role);
};