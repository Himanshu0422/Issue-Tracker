"use client";

import { Issue } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];

const StatusDropdown = ({ issue }: { issue: Issue }) => {
    const [loading, setLoading] = useState(false);

    const updateStatus = async (newStatus: string) => {
        setLoading(true);
        try {
            await axios.patch(`/api/issues/${issue.id}/status`, { status: newStatus });
            toast.success("Status updated successfully!");
        } catch {
            toast.error("Could not update status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Select.Root
                defaultValue={issue.status}
                onValueChange={updateStatus}
                disabled={loading}
            >
                <Select.Trigger placeholder="Update Status..." />
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Status</Select.Label>
                        {statuses.map((status) => (
                            <Select.Item key={status} value={status}>
                                {status}
                            </Select.Item>
                        ))}
                    </Select.Group>
                </Select.Content>
            </Select.Root>
            {loading && (
                <div className="flex justify-center mt-4">
                    <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <Toaster />
        </>
    );
};

export default StatusDropdown;
