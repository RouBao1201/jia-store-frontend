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
