import { SET_PRODUCT_CATEGORIES, SET_PRODUCT_CATEGORY } from '../types'

export type State = Readonly<{
    productCategories: [],
    productCategory: object
}>

const initialState: State = {
    productCategories: [],
    productCategory: {}
}


export default function productReducers(state = initialState, action: any) {
    switch (action.type) {
        case SET_PRODUCT_CATEGORIES:
            return {
                ...state,
                productCategories: action.payload,
            }
        case SET_PRODUCT_CATEGORY:
            return {
                ...state,
                productCategory: action.payload,
            }
        default:
            return state
    }
}
