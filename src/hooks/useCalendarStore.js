import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store"
import calendarApi from "../api/calendarApi"
import { convertEventsToDate } from "../helpers"
import Swal from "sweetalert2"
export const useCalendarStore = () => {

    const dispatch = useDispatch()
    const { events, activeEvent } = useSelector( state => state.calendar )
    const { user } = useSelector( state => state.auth )
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) )
    }

    const startSavingEvent = async( calendarEvent ) => {
        //* update event
        try {

            if( calendarEvent.id ){
                //Actualizando
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent)
                dispatch( onUpdateEvent({ ...calendarEvent, user }) )
                return
            }

            //*Creando
            const { data } = await calendarApi.post('/events', calendarEvent) 
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }) )

        } catch (error) {
            console.log(error)
            Swal.fire('Error al guardar', error.response.data.mgs, 'error')
        }
    }

    //* startDeletingEvent
    const startDeletingEvent = async() => {

        try {
            
            await calendarApi.delete(`/events/${ activeEvent.id }`)
            dispatch( onDeleteEvent() )
            
        } catch (error) {
            console.log(error)
            Swal.fire('Error al eliminar', error.response.data.mss, 'error')
        }
    }

    const startLoadingEvents = async( calendarEvent ) => {
        
        try {
            
            const { data } = await calendarApi.get('/events')
            const events = convertEventsToDate( data.eventos )
            dispatch( onLoadEvents( events ) )


        } catch (error) {
            console.log("Error cargando eventos")
            console.log(error)
        }

    }

    return {
        //*Propiedad
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //*Metodos
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents,
    }

}
