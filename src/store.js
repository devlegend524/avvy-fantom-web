import { configureStore } from '@reduxjs/toolkit';

// import reducers
import darkmodeService from './services/darkmode/reducer'


const reducerMap = {}

new Array(
  //services
  darkmodeService,
).forEach(service => {
  reducerMap[service.reducerName] = service.reducer
})

export const store = configureStore({
  reducer: reducerMap
});

export default store
