import { useAuthStore, useCalendarStore, useUiStore } from "../../hooks"

export const FabDelete = () => {

    const { user } = useAuthStore()
    const { startDeletingEvent, hasEventSelected } = useCalendarStore()

    const handleDelete = () => {
        startDeletingEvent()
    }

    return (
        <button aria-label="btnDelete" className="btn btn-danger fab-danger" 
        onClick={ handleDelete }
        style={{
            display: hasEventSelected ? '': 'none'
        }}>
            <i className="fas fa-trash-alt" ></i>
        </button>
    )
}
