import { createContext, useCallback, useContext, useEffect, useReducer } from "react";


const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();


const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: null
}

function reducer(state, action) {
    switch (action.type) {
        case 'loading':
            return {
                ...state,
                isLoading: true
            }

        case 'cities/loaded':
            return {
                ...state,
                cities: action.payload,
                isLoading: false
            }

        case 'city/loaded':
            return {
                ...state,
                currentCity: action.payload,
                isLoading: false
            }

        case 'cities/created':
            return {
                ...state,
                cities: [...state.cities, action.payload],
                isLoading: false
            }

        case 'cities/deleted':
            return {
                ...state,
                cities: state.cities.filter(city => city.id !== action.payload),
                isLoading: false
            }

        case 'rejected':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            }

        default:
            throw new Error("Action unknown");
    }
}


function CitiesProvider({ children }) {
    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState)

    useEffect(function () {
        async function getCities() {
            dispatch({ type: 'loading' });

            try {
                const response = await fetch(`${BASE_URL}/cities`);
                const data = await response.json();

                dispatch({ type: 'cities/loaded', payload: data });
            } catch (error) {
                dispatch({ type: 'rejected', payload: 'There was an error fetching' });
            }
        }

        getCities();
    }, []);

    const getCity = useCallback(async function (id) {
        if (Number(id) === currentCity.id)
            return;

        dispatch({ type: 'loading' });

        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();

            dispatch({ type: 'city/loaded', payload: data });
        } catch (error) {
            dispatch({ type: 'rejected', payload: 'There was an error fetching' });
        }
    }, [currentCity.id]);

    async function createCity(newCity) {
        dispatch({ type: 'loading' });

        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            dispatch({ type: 'cities/created', payload: data });
        } catch (error) {
            dispatch({ type: 'rejected', payload: 'There was an error creating city' });
        }
    }

    async function deleteCity(id) {
        dispatch({ type: 'loading' });

        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE'
            });

            dispatch({ type: 'cities/deleted', payload: id });
        } catch (error) {
            dispatch({ type: 'rejected', payload: 'There was an error deleting city' });
        }
    }


    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            currentCity,
            getCity,
            createCity,
            deleteCity
        }} >
            {children}
        </CitiesContext.Provider>
    )
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined)
        throw new Error('CitiesContext is undefined')

    return context
}

export { useCities, CitiesProvider }