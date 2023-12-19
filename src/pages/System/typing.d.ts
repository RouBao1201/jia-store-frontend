declare namespace API {
  /**字典配置**/
  type DictConfigItem = {
    id: number;
    dictKey: string;
    label: string;
    value: string;
  }

  type DictConfigCreateItem = {
    dictKey: string;
    dictPair: DictPaidItem[];
  }

  type DictPaidItem = {
    label: string;
    value: string;
  }
}
