declare namespace API {
  /**字典配置**/
  type DictConfigItem = {
    id: number;
    dictKey: string;
    label: string;
    value: string;
  }
  /**字典配置新增**/
  type DictConfigAddItem = {
    dictKey: string;
    dictPair: DictPairItem[];
  }
  /**字典键值对**/
  type DictPairItem = {
    label: string;
    value: string;
  }
  /**角色配置**/
  type RoleItem = {
    id: number;
    name: string;
    status: number;
  }
  /**角色配置**/
  type RoleChangedStatusItem = {
    id: number;
    status: number;
  }
  /**角色权限查询实体**/
  type RolePermissionQueryItem = {
    id: number;
  }

  /**角色权限修改请求实体**/
  type RolePermissionsChangedItem = {
    role: number;
    permissionIds: string[];
    type: string
  }
}
