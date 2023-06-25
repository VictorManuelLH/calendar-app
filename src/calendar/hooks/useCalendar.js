import { useEffect, useMemo, useState } from "react"
import { addHours, differenceInSeconds } from 'date-fns'
import Swal from 'sweetalert2'
import { useCalendarStore, useUiStore } from "../../hooks"

export const useCalendar = () => {

    const { closeDateModal } = useUiStore()

    const customStyles = {
        content: {
            top: '65%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-0%',
            transform: 'translate(-40%, -65%)',
        },
    }

    const { isDateModalOpen } = useUiStore()
    const { activeEvent, startSavingEvent } = useCalendarStore()
    const [formSubmitted, setFormSubmitted] = useState(false)

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 )
    })

    const titleClass = useMemo(() => {
        if( !formSubmitted ) return ''

        return ( formValues.title.length > 0 )
        ? ''
        : 'is-invalid'  

    }, [formValues.title, formSubmitted])

    useEffect(() => {

        if( activeEvent !== null ){
            setFormValues({ ...activeEvent })
        }
    
    
        
    }, [activeEvent])
    

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [ target.name ]: target.value
        })
    }

    const onDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [ changing ]: event
        })
    }

    const onCloseModal = () => {
        console.log('Cerrando modal')
        closeDateModal()
    }

    const onSubmit = async( event ) => {
        event.preventDefault()
        setFormSubmitted( true )
        const difference = differenceInSeconds( formValues.end, formValues.start )
        if( isNaN( difference ) || difference <= 0 ){
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
            return
        }
        if( formValues.title.length <= 0 ) return
        console.log(formValues)
        await startSavingEvent( formValues )
        closeDateModal()
    }

    return {
        ...formValues,
        customStyles,
        formValues,
        isDateModalOpen,
        onCloseModal,
        onDateChanged,
        onInputChanged,
        onSubmit,
        titleClass,
    }

}
