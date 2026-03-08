"use client";
import { useMemo, useEffect, useState } from "react";
import { usersService } from "../services/management.service";
import { CreateUserDTO, UserDTO } from "../types";



export function useManagement() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchUser, setSearchUser] = useState("");
    const [roleFilter, setRoleFilter] = useState<"ALL" | "Admin" | "User">("ALL");
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = await usersService.list({
                search: searchUser,
                role: roleFilter,
            });
            setUsers(userData);
        } catch (error: any) {
            setError(error.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, [searchUser, roleFilter]);

    const addUser = async (payload: CreateUserDTO) => {
        try {
            await usersService.create({
                ...payload,
                password: payload.password ?? "",
            });
        } catch (error: any) {
            setError(error.message || "Failed to add user");
        } finally {
            await fetchUsers();
        }
    }

    const removeUser = async (empID: string) => {
        try {
            await usersService.remove(empID);
        } catch (error: any) {
            setError(error.message || "Failed to remove user");
        } finally {
            await fetchUsers();
        }
    }

    const filteredUsers = useMemo(() => {
    return users;
  }, [users]);

    return { refetch: fetchUsers, users: filteredUsers, loading, error, searchUser, roleFilter, setSearchUser, setRoleFilter, removeUser, addUser };
}
