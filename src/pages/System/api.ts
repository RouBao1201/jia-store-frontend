import {request} from '@umijs/max';

export async function queryDictConfigList(body: API.DictConfigItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dict/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
