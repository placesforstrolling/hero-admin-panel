import { createSlice } from "@reduxjs/toolkit";
import filters from "../../reducers/filters";

const initialState = {
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
}

const filtersSlice = createSlice({
    name: filters,
    initialState,
    reducers: {
        filtersFetching: state => {state.filtersLoadingStatus = 'fetching'},
        filtersFetched: (state, action) => {
            state.filtersLoadingStatus = 'idle';
            state.filters = action.payload;
        },
        filtersFetchingError: state => {state.filtersLoadingStatus = 'error'},
        activeFilterChanged: (state, action) => {state.activeFilter = action.payload}
    }
})

const {actions, reducer} = filtersSlice;

export default reducer;
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;