import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../__fixtures__/authStates"
import { testUserCredential } from "../../__fixtures__/testUser"

describe('Pruebas en el authSlice', () => {
    
    test('Debe de regresar el estado inicial', () => {
        
        expect( authSlice.getInitialState() ).toEqual( initialState )

    })
    test('Debe de realizar un login', () => {
        
        const state = authSlice.reducer( initialState, onLogin( testUserCredential ) )

        expect( state ).toEqual({

            status: 'authenticated',
            user: testUserCredential,
            errorMessage: undefined

        })

    })
    test('Debe de realizar un logout', () => {
        
        const state = authSlice.reducer( authenticatedState, onLogout() )

        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        })

    })
    test('Debe de realizar un logout', () => {
        
        const errorMessage = 'credenciales no validas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) )

        expect( state ).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage
        })

    })
    test('Debe de limpiar el mensaje de error', () => {
        
        const errorMessage = 'credenciales no validas'
        const state = authSlice.reducer( authenticatedState, onLogout(errorMessage) )
        const newState = authSlice.reducer( state, clearErrorMessage() )

        expect( newState.errorMessage ).toBe( undefined )

    })

})