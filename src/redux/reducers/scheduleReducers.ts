import { TIME_SLOTS, SCHEDUELES, SET_APPOITNMENT, SET_APPOITNMENT_ORDER } from '../types'

export type State = Readonly<{
    timeSlots: [],
    schedule: [],
    appointment: object,
    appointmentOrder: object,
}>

const initialState: State = {
    timeSlots: [],
    schedule: [],
    appointment: {},
    appointmentOrder: {},
}

export default function scheduleReducers(state = initialState, action: any) {
    switch (action.type) {
        case TIME_SLOTS:
            return {
                ...state,
                totalSlots: action.payload,
            }
        case SCHEDUELES:
            return {
                ...state,
                schedules: action.payload,
            }
        case SET_APPOITNMENT:
            return {
                ...state,
                appointment: action.payload,
            }
        case SET_APPOITNMENT_ORDER:
            return {
                ...state,
                appointmentOrder: action.payload,
            }
        default:
            return state
    }
}