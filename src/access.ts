/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const {currentUser} = initialState ?? {};
  const accessMap = {};
  currentUser?.userAuth?.forEach(value => {
    if (value.type === "MENU") {
      accessMap[value.authKey] = true;
    }
  });
  // 超级管理员页面授权
  if (currentUser?.superAdmin) {
    accessMap['SuperAdmin'] = true;
  }
  return {
    ...accessMap
  };
}
