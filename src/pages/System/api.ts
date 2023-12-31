import {request} from '@umijs/max';

/**分页查询字典配置**/
export async function listPageDictConfig(body: API.DictConfigItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/listPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**新增字典配置**/
export async function saveDictConfig(body: API.DictConfigAddItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**修改字典配置**/
export async function updateDictConfig(body: API.DictConfigItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**删除字典配置**/
export async function removeDictConfig(id: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/remove', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {id: id},
    ...(options || {}),
  });
}

/**分页查询字典配置**/
export async function listPageRole(body: API.RoleItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/listPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**删除角色配置**/
export async function changeRoleStatus(body: API.RoleChangedStatusItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/changedStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**新增角色**/
export async function saveRole(body: API.RoleItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**查询所有角色**/
export async function listAllRole(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/listAllRole', {
    method: 'GET',
    ...(options || {}),
  });
}

/**查询角色权限**/
export async function listRolePermissions(body: API.RolePermissionQueryItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/listRolePermissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**查询所有权限**/
export async function listAllPermissions(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/permission/listAll', {
    method: 'GET',
    ...(options || {}),
  });
}

/**角色权限修改**/
export async function changeRolePermissions(body: API.RolePermissionsChangedItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/changeRolePermissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
