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
  console.log(JSON.stringify(accessMap));
  return {
    ...accessMap
  };
}
