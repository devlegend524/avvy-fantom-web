//
// This file is responsible for generating links throughout the
// application, so that if a path needs to be changed it's not
// a difficult task.
//

const paths = {
  Landing: '/',
  MyDomains: '/user/domains',
  SunriseAuction: '/sunrise',
}

const linking = {
  path: (pathName, params) => {
    const path = paths[pathName]
    if (!path) throw `Missing path "${pathName}". Check services/linking.js.`
    // will need to do some substitution with 
    // path params here
    return path
  }
}

export default linking
