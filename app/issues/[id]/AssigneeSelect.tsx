"use client";

import Skeleton from "@/app/components/Skeleton";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
    const { data: users, error, isLoading } = useUsers();
    const [loading, setLoading] = useState(false);

    if (isLoading) return <Skeleton />;

    if (error) return null;

    const assignIssue = async (userId: string) => {
        setLoading(true);
        try {
            await axios.patch("/api/issues/" + issue.id, {
                assignedToUserId: userId || null,
            });
            toast.success("Issue assigned successfully!");
        } catch {
            toast.error("Changes could not be saved.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Select.Root
                defaultValue={issue.assignedToUserId || ""}
                onValueChange={assignIssue}
                disabled={loading}
            >
                <Select.Trigger placeholder="Assign..." />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Suggestions</Select.Label>
                        <Select.Item value="Unassigned">Unassigned</Select.Item>
                        {users?.map((user) => (
                            <Select.Item key={user.id} value={user.id}>
                                {user.name}
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            {loading && (
                <div className="flex justify-center mt-4">
                    <div className="h-6 w-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <Toaster />
        </>
    );
};

const useUsers = () =>
    useQuery<User[]>({
        queryKey: ["users"],
        queryFn: () => axios.get("/api/users").then((res) => res.data),
        staleTime: 60 * 1000,
        retry: 3,
    });

export default AssigneeSelect;
