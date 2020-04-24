import  { combineReducers} from 'redux'

import  { CHANGE_DIALOG } from './types'

//initial state

function changeDialog(state = false, action) {
	if (action.type === CHANGE_DIALOG){
		return state = action.dialog
	}
	return state
}



export const rootReducer = combineReducers({
  dialog: changeDialog
})