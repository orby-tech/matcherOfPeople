import  { CHANGE_DIALOG } from './types'


export function changeDialog(dialog) {
	return {
		type: CHANGE_DIALOG,
		dialog
	}
}
