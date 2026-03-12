"use client";

import { useEffect, useState, useCallback } from "react";
import type { InspectionRowDTO, UpdateUserDTO, UserDTO } from "../types";
import { usersService } from "../services/management.service";
import { userInfoService } from "../services/userInfo.service";
import { getMonthlyInspectionData } from "../services/monthly-tracker.service";

export function useUserHooks(empID: string) {
    const [user, setUser] = useState<UserDTO | null>(null);
    const [records, setRecords] = useState<InspectionRowDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchRecord, setSearchRecord] = useState("");
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [locationFilter, setLocationFilter] = useState<string[]>([]);
    const [monthlyData, setMonthlyData] = useState<any>(null);
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [monthlyLoading, setMonthlyLoading] = useState<boolean>(false);

    const fetchUserInfo = useCallback(async () => {
        if (!empID) return;
        try {
            const userData = await usersService.getById(empID);
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    }, [empID]);

    const fetchUserInfoV2 = async () => {
        if (!empID) return;
        try {
            const userData = await usersService.getById(empID);
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    }

    const fetchUserRecords = useCallback(async () => {
        if (!empID) return;
        try {
            const recordData = await userInfoService.listInspections(empID, {
                search: searchRecord,
                type: typeFilter.length === 1 ? typeFilter[0] : "",
                location: locationFilter.length === 1 ? locationFilter[0] : ""
            });

            setRecords(recordData);
        } catch (error) {
            console.error("Failed to fetch user records:", error);
        }
    }, [empID, searchRecord, typeFilter, locationFilter]);

    const fetchUserRecordsV2 = async () => {
        if (!empID) return;
        try {
            const recordData = await userInfoService.listInspections(empID, {
                search: searchRecord,
                type: typeFilter.length === 1 ? typeFilter[0] : "",
                location: locationFilter.length === 1 ? locationFilter[0] : ""
            });

            setRecords(recordData);
        } catch (error) {
            console.error("Failed to fetch user records:", error);
        }
    }

    const fetchMonthlyData = useCallback(async () => {
        if (!empID) return;
        setMonthlyLoading(true);
        try {
            const data = await getMonthlyInspectionData(empID, month, year);
            setMonthlyData(data);
        } catch (error) {
            console.error("Failed to fetch monthly data:", error);
        } finally {
            setMonthlyLoading(false);
        }
    }, [empID, month, year]);

    const fetchMonthlyDataV2 = async () => {
        if (!empID) return;
        setMonthlyLoading(true);
        try {
            const data = await getMonthlyInspectionData(empID, month, year);
            setMonthlyData(data);
        } catch (error) {
            console.error("Failed to fetch monthly data:", error);
        } finally {
            setMonthlyLoading(false);
        }
    }

    useEffect(() => {
        if (!empID) return;
        Promise.all([
            fetchUserInfoV2(),
            fetchUserRecordsV2(),
            fetchMonthlyDataV2(),
        ]).finally(() => {
            setLoading(false);
        });
    }, [empID, searchRecord, typeFilter, locationFilter, month, year]);

    const updateUser = useCallback(
        async (payload: UpdateUserDTO) => {
            await usersService.update(empID, payload);
            await fetchUserInfo();
        },
        [empID, fetchUserInfo]
    );

    return {
        user,
        records,
        loading,

        searchRecord,
        setSearchRecord,

        typeFilter,
        setTypeFilter,

        locationFilter,
        setLocationFilter,

        monthlyData,
        monthlyLoading,
        month,
        year,
        setMonth,
        setYear,

        updateUser,

        refetchUser: fetchUserInfoV2,
        refetchRecords: fetchUserRecordsV2,
        refetchMonthlyData: fetchMonthlyDataV2,
    };
}