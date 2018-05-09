import { createStore, applyMiddleware } from "redux"
import logger from 'redux-logger'
import initialState from './initialState'
import reducer from './reducers/placeNavigationReducer'

const getStore = () => createStore(reducer, initialState, applyMiddleware(logger))
export default getStore
