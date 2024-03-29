/**
 * Show the schedules for professionals based on preferences.
 * 
 * @param {boolean} preferProfessional - Indicates if user prefer professional or schedules.
 * @param {function} setCanScrollToEnd - Callback function to set if scrolling to end is possible.
 * @returns {JSX.Element} - The rendered component.
 */

import { useContext, useEffect } from "react"

import { Professionals } from "./Professionals"
import { CalendarComponent } from "./CalendarComponent"
import { Schedules } from "./Schedules"

import { ScheduleContext } from "../context/ScheduleContext"

export const ShowProfessionalsDaySchedules = ({ preferProfessional, setCanScrollToEnd }) => {
    const { schedule } = useContext(ScheduleContext)

    useEffect(() => {
        if (schedule.professional || schedule.day || schedule.schedule) setCanScrollToEnd(true)

    }, [schedule.professional, schedule.day, schedule.schedule])

    return (
        // Render components based on preferences
        preferProfessional ?
            (
                <>
                    <Professionals preferProfessional={preferProfessional} />
                    {schedule.professional && <CalendarComponent preferProfessional={preferProfessional} />}
                    {schedule.day && schedule.professional && <Schedules preferProfessional={preferProfessional} />}
                </>
            ) :
            (
                <>
                    <Schedules preferProfessional={preferProfessional} />
                    {schedule.schedule && <CalendarComponent preferProfessional={preferProfessional} />}
                    {schedule.day && schedule.schedule && <Professionals preferProfessional={preferProfessional} />}
                </>
            )
    )
}