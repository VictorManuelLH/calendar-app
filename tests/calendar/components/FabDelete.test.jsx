const { render, screen, fireEvent } = require("@testing-library/react")
const { FabDelete } = require("../../../src/calendar/components/FabDelete")
const { useCalendarStore } = require("../../../src/hooks")
const { Provider } = require("react-redux")
const { store } = require("../../../src/store")


describe('Pruebas en FabDelete', () => {

    const mockStartDeletingEvent = jest.fn()

    beforeEach( () => jest.clearAllMocks() )

    test('Debe de mostrar del componente correctamente', () => {
        
        render(
            <Provider store={store} >
                <FabDelete/> 
            </Provider> 
        )
        
        const btn = screen.getByLabelText('btnDelete')

        expect( btn.classList ).toContain('btn')
        expect( btn.classList ).toContain('btn-danger')
        expect( btn.classList ).toContain('fab-danger')
        
    })

    test('Debe de mostrar el boton si hay un evento activo', () => {
        
        render(
            <Provider store={store} >
                <FabDelete/> 
            </Provider> 
        )
        
        const btn = screen.getByLabelText('btnDelete')

        expect( btn.style.display ).toBe('none')
        
    })


})