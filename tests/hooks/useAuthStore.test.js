import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../__fixtures__/authStates"
import { testUserCredential } from "../__fixtures__/testUser"
import { calendarApi } from "../../src/api"

const getMockStore = () => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('Pruebas en el useAuthStore', () => {

    beforeEach( () => localStorage.clear() )
    
    test('Debe regresar el estado por defecto', () => {
        
        const mockStore = getMockStore({ ...initialState })
        
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        expect( result.current ).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
        })

    })

    test('startLogin debe realizar el login correctamente', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async () => {
            await result.current.startLogin( testUserCredential )
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: "Test user",
                uid: "649280ba46805f4383e933ce"
            },
        })

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) )
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) )

    })

    test('startLogin debe fallar el login', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async () => {
            await result.current.startLogin({ email: "kas", password:"askldka" })
        })

        const { errorMessage, status, user } = result.current

        expect( localStorage.getItem('token') ).toBe( null )
        expect({ errorMessage, status, user }).toEqual( {
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        })

        await waitFor(
            () => expect( result.current.errorMessage ).toBe( undefined )
        )

    })

    test('startRegister debe de crear un usuario', async() => {

        const newUser = { email: "kas", password:"askldka", name:"TestUser2" }

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                "ok": true,
                "uid": "123457898765",
                "name": "Test user",
                "token": "ALGUN-TOKEN"
            }
        })

        await act( async () => {
            await result.current.startRegister( newUser )
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test user', uid: '123457898765' }
        })

        spy.mockRestore()

    })

    test('startRegister debe de fallar la creacion', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async () => {
            await result.current.startRegister( testUserCredential )
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Ya existe un usuario con ese correo",
            status: "not-authenticated",
            user: {}
        })

    })

    test('checkAuthToken debe de fallar si no hay token', async() => {

        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })

    })

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {

        const { data } = await calendarApi.post('/auth', testUserCredential)
        localStorage.setItem( 'token', data.token )

        const mockStore = getMockStore({ ...initialState })
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        })

        await act( async () => {
            await result.current.checkAuthToken()
        })

        const { errorMessage, status, user } = result.current

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: {
                name: "Test user",
                uid: "649280ba46805f4383e933ce",
            }
        })

    })



})