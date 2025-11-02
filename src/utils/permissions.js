export const ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  VIEWER: 'Viewer'
};

export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_PROJECTS: 'manage_projects',
  EDIT_CONTENT: 'edit_content',
  VIEW_CONTENT: 'view_content',
  DELETE_PROJECT: 'delete_project',
  MANAGE_SETTINGS: 'manage_settings',
  INVITE_USERS: 'invite_users',
  REMOVE_USERS: 'remove_users',
  EDIT_BOARD: 'edit_board',
  DELETE_BOARD: 'delete_board',
  CREATE_BOARD: 'create_board',
  MOVE_CARDS: 'move_cards',
  EDIT_CARDS: 'edit_cards',
  DELETE_CARDS: 'delete_cards',
  CREATE_CARDS: 'create_cards',
  EDIT_PAGES: 'edit_pages',
  DELETE_PAGES: 'delete_pages',
  CREATE_PAGES: 'create_pages',
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_PROJECTS,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.INVITE_USERS,
    PERMISSIONS.EDIT_BOARD,
    PERMISSIONS.CREATE_BOARD,
    PERMISSIONS.MOVE_CARDS,
    PERMISSIONS.EDIT_CARDS,
    PERMISSIONS.DELETE_CARDS,
    PERMISSIONS.CREATE_CARDS,
    PERMISSIONS.EDIT_PAGES,
    PERMISSIONS.DELETE_PAGES,
    PERMISSIONS.CREATE_PAGES,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.MOVE_CARDS,
    PERMISSIONS.EDIT_CARDS,
    PERMISSIONS.CREATE_CARDS,
    PERMISSIONS.EDIT_PAGES,
    PERMISSIONS.CREATE_PAGES,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_CONTENT
  ]
};

export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

export const canEdit = (role) => {
  return hasPermission(role, PERMISSIONS.EDIT_CONTENT);
};

export const canDelete = (role) => {
  return [ROLES.OWNER, ROLES.ADMIN].includes(role);
};

export const canManage = (role) => {
  return hasPermission(role, PERMISSIONS.MANAGE_PROJECTS);
};

export const canView = (role) => {
  return hasPermission(role, PERMISSIONS.VIEW_CONTENT);
};

export const getRoleLabel = (role) => {
  return role || 'Unknown';
};