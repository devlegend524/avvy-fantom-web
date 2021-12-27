import { configureStore } from '@reduxjs/toolkit';

// import reducers
import services from 'services'
import views from 'views'


const reducerMap = {}

new Array(
  views.Domain.redux.reducer,
  services.darkmode.reducer,
  services.user.reducer
).forEach(service => {
  reducerMap[service.reducerName] = service.reducer
})

export const store = configureStore({
  reducer: reducerMap
});

export default store
