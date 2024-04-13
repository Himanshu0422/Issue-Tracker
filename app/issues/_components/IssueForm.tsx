"use client";

import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
const SimpleMde = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});

type IssueFormData = z.infer<typeof createIssueSchema>;

interface Props{
    issue? : Issue
}

const IssueForm = ({ issue }: { issue?: Issue }) => {
    const router = useRouter();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IssueFormData>({
        resolver: zodResolver(createIssueSchema),
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSiubmitting] = useState(false);

    const onSubmit = async (data: IssueFormData) => {
        try {
            setIsSiubmitting(true);
            await axios.post("/api/issues", data);
            router.push("/issues");
        } catch (error) {
            setIsSiubmitting(false);
            setError("Unexpected error occurred");
        }
    };

    return (
        <div className="max-w-xl ">
            {error && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <TextField.Root defaultValue={issue?.title} placeholder="Title" {...register("title")} />
                <ErrorMessage>
                    {errors.title?.message}
                </ErrorMessage>
                <Controller
                    name="description"
                    control={control}
                    defaultValue={issue?.description}
                    render={({ field }) => (
                        <SimpleMde placeholder="Description" {...field} />
                    )}
                />
                <ErrorMessage>
                    {errors.description?.message}
                </ErrorMessage>
                <Button>Submit new Issue {isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    );
};

export default IssueForm;
