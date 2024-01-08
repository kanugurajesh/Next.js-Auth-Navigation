"use client"

import Link from "next/link";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Profile() {
    
    const router = useRouter();
    const [data, setData] = useState("nothing");

    // creating a logout function to send a request to the logout functionality in the backend
    const logout = async () => {
        try {
            const response = await fetch("/api/users/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                router.push("/login");
            } else {
                toast.error(data.message);
            }

        } catch (error:any) {
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        const res = await fetch("/api/users/user")
        const data = await res.json();
        setData(data.data._id)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Toaster />
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <h2 className="p-1 rounded bg-green-500">{data === 'nothing' ? 'Nothing' : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
            <hr />
            <Button onClick={logout}>LogOut</Button>
            <Button onClick={getUserDetails}>Get User Details</Button>
        </div>
    )
}