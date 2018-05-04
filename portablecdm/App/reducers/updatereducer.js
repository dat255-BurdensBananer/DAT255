import {
    ADD_UPDATED_PORTCALL,
    REMOVE_UPDATED_PORTCALL,
} from '../actions/types';

const INITIAL_STATE = {
    portCalls: [],
}

const updateReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ADD_UPDATED_PORTCALL:
            if(state.portCalls.includes(action.payload)) return state; // No duplicates
            return { ...state, portCalls: [...state.portCalls, action.payload],}
        case REMOVE_UPDATED_PORTCALL:
            const portCallsCopy = state.portCalls.slice();
            portCallsCopy.splice(portCallsCopy.indexOf(action.payload), 1);
            return {...state, portCalls: portCallsCopy};
        default:
            return state;
    }
}

export default updateReducer;
