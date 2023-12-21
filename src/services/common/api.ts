import {request} from '@umijs/max';

/** 获取字典配置 POST /dict/dictConfig */
export async function listDictConfig(dictKey: string) {
  return request<Record<string, any>>('/api/dict/listDictConfig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {dictKey},
  });
}
