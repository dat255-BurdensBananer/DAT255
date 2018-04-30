import * as types from './types';

export const toggleUpdatedPortCall = (portCallId) => {
    return (dispatch, getState) => {
        if(getState().updated.portCalls.includes(portCallId)) {
            dispatch({
                type: types.REMOVE_UPDATED_PORTCALL,
                payload: portCallId,
            });

            return false;
        }

        dispatch({
            type: types.ADD_UPDATED_PORTCALL,
            payload: portCallId,
        });

        return true;
    }


}
