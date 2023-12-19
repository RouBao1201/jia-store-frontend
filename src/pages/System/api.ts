import {request} from '@umijs/max';

/**分页查询字典配置**/
export async function queryPageDictConfigList(body: API.DictConfigItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/pageList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**新增字典配置**/
export async function createDictConfig(body: API.DictConfigCreateItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/create', {
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
export async function deleteDictConfig(id: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {id: id},
    ...(options || {}),
  });
}
