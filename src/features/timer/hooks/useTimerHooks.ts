import { useEffect, useState } from "react"
import { getRecordsInfo } from "../../workorders/services/workOrder.service"
import { getInspection } from "../services/timer.service"

export function useTimerHooks(id: any) {
    const [recordsInfo, setRecordsInfo] = useState<any>({})
    const [recordsTotal, setRecordsTotal] = useState<Number>(0)
    const [recordsInfoLoading, setRecordsInfoLoading] = useState<boolean>(true)
    const [recordsInfoError, setrecordsInfoError] = useState<string | null>(null)

    const fetchRecordInfo = async () => {
        setRecordsInfoLoading(true)
        setrecordsInfoError(null)
        try {
            const res = await getInspection(id)
            setRecordsInfo(res.data)
        } catch (e: any) {
            console.error(e)
            setrecordsInfoError(e?.message)
        } finally {
            setRecordsInfoLoading(false)
        }
    }

    useEffect(() => {
        fetchRecordInfo()
    }, [])

    return {
        recordsInfo,
        recordsInfoLoading,
        recordsTotal
    }
}