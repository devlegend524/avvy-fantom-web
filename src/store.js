import { configureStore } from '@reduxjs/toolkit';

// import reducers
import services from 'services'
import views from 'views'


const reducerMap = {}

const reducers = [
  views.Domain.redux.reducer,
  services.cart.reducer,
  services.darkmode.reducer,
  services.user.reducer
]

reducers.forEach(service => {
  reducerMap[service.reducerName] = service.reducer
})

export const store = configureStore({
  reducer: reducerMap
});

export default store
