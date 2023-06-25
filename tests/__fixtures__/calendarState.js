export const events = [
    {
        id: '1',
        start: new Date('2022-06-22 16:36:00'),
        end: new Date('2022-06-22 18:36:00'),
        title: 'cumpleaños del Victorr',
        notes: 'Alguna nota',
    },
    {
        id: '2',
        start: new Date('2022-07-22 16:36:00'),
        end: new Date('2022-07-22 18:36:00'),
        title: 'cumpleaños del Melisa',
        notes: 'Alguna nota de Melisa',
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: true,
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: true,
    events: [ ...events ],
    activeEvent: { ...events[0] }
}