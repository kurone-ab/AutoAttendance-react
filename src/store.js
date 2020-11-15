import {createStore} from 'redux'

const initialState = {
    sidebarShow: 'responsive'
}

export const actions = {
    place: "place",
    user: "user",
    placeList: "placeList",
}

const changeState = (state = initialState, {type, ...rest}) => {
    console.log(type)
    switch (type) {
        case 'set':
            return {...state, ...rest}
        case actions.place:
            const {placeID, users} = rest
            const {places, ...preState} = state
            for (let place of places) {
                if (place.placeID === placeID) {place["users"] = users;break}
            }
            return {
                ...preState,
                places
            }
        case actions.placeList:
            return {
                ...state,
                places: rest.result
            }
        default:
            return state
    }
}

const store = createStore(changeState)

export default store