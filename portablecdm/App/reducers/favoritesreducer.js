import {
    ADD_FAVORITE_PORTCALL,
    REMOVE_FAVORITE_PORTCALL,
    ADD_FAVORITE_VESSEL,
    REMOVE_FAVORITE_VESSEL,
    CLEAR_FAVORITES,
    ADD_FAVORITE_LOCATIONS,
    TOGGLE_ON,
    TOGGLE_OFF,
} from '../actions/types';

const INITIAL_STATE = {
    vessels: [],
    tempVessels: [],
    portCalls: [],
    tempLocations: [],
    locations: [],
    test: 0,
}

const favoritesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ADD_FAVORITE_PORTCALL:
            if(state.portCalls.includes(action.payload)) return state; // No duplicates
            return { ...state, portCalls: [...state.portCalls, action.payload],}
        case REMOVE_FAVORITE_PORTCALL:
            const portCallsCopy = state.portCalls.slice();
            portCallsCopy.splice(portCallsCopy.indexOf(action.payload), 1);
            return {...state, portCalls: portCallsCopy};
        case ADD_FAVORITE_VESSEL:
            if(state.vessels.includes(action.payload)) return state;
            return { ...state, vessels: [...state.vessels, action.payload]};
        case REMOVE_FAVORITE_VESSEL:
            const vesselsCopy = state.vessels.slice();
            vesselsCopy.splice(vesselsCopy.indexOf(action.payload), 1);
            return {...state, vessels: vesselsCopy};
        case ADD_FAVORITE_LOCATIONS:
            return {...state, locations: action.payload};
        case CLEAR_FAVORITES:
            return INITIAL_STATE;
        case TOGGLE_OFF:
            return {...state, tempLocations : state.locations, tempVessels : state.vessels, locations: [], vessels : []};
        case TOGGLE_ON:
            return {...state, locations : state.tempLocations, vessels : state.tempVessels};
        default:
            return state;
    }
}

export default favoritesReducer;
