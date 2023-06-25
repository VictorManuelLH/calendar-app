import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, events, initialState } from "../../__fixtures__/calendarState"

describe('Pruebas en calendarSlice', () => {
    
    test('Debe de regresar el estado por defecto', () => {
        
        const state = calendarSlice.getInitialState()
        expect( state ).toEqual( initialState )

    })

    test('onSetActiveEvent debe de activar el evento', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onSetActiveEvent( events[0] ) )
        expect( state.activeEvent ).toEqual( events[0] )
    })

    test('onAddNewEvent debe de agregar el evento', () => {
        const newEvent = {
            id: '3',
            start: new Date('2022-08-22 16:36:00'),
            end: new Date('2022-08-22 18:36:00'),
            title: 'cumpleaños del alguien',
            notes: 'Alguna nota de alguien',
        }
        const state = calendarSlice.reducer( calendarWithActiveEventState, onAddNewEvent( newEvent ) )
        expect( state.events ).toEqual([ ...events, newEvent ])
    })

    test('onUpdateEvent debe de actualizar el evento', () => {
        const updateEvent = {
            id: '1',
            start: new Date('2022-10-22 16:36:00'),
            end: new Date('2022-10-22 18:36:00'),
            title: 'cumpleaños del alguien',
            notes: 'Alguna nota de alguien',
        }
        const state = calendarSlice.reducer( calendarWithActiveEventState, onUpdateEvent( updateEvent ) )
        expect( state.events ).toContain( updateEvent )
    })

    test('onDeleteEvent debe de borrar el evento', () => {
        const deleteEvent = {
            id: '1',
        }
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() )
        expect( state.activeEvent ).toBe( null )
        expect( state.events ).not.toContain( events[0] )
    })

    test('onLoadEvents debe de establecer el evento', () => {
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) )
        expect( state.isLoadingEvents ).toBeFalsy()
        expect( state.events ).toEqual( events )
        
    })

    test('onLogoutCalendar debe de restablecer el evento', () => {
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar( ...events ) )
        expect( state ).toEqual( initialState )
    })

})