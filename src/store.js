import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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

const persistedReducer = persistReducer({
    key: 'root',
    storage,
  },
  combineReducers(reducerMap)
)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk),
);

let persistor = persistStore(store)

export default store
