import initialState from '../initialState'

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'UPDATE_CURRENT_PLACE_INDEX':
      return {
        ...state,
        currentPlaceIndex: payload
      }
      break
    default:
      return state
  }
}
