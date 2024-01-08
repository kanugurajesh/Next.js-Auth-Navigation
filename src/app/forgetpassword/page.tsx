"use client"

import React, { useState, useEffect } from 'react'
import toast, {Toaster} from 'react-hot-toast';
import { Button } from '@/components/ui/button';
export default function ForgetPassword() {

    const [email, setEmail] = useState<string>("");
    const [emailStatus, setEmailStatus] = useState<boolean>(false);

    const sendForgetEmail = async () => {
        try {
            const response = await fetch("/api/users/forgetpassword/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email:email})
            });

            const data = await response.json()
            
            if(data.success) {
                toast.success(data.message)
                setEmailStatus(true)
            } else {
                toast.error(data.error)
            }
        } catch(error:any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col justify-center h-screen items-center">
            <Toaster />
            <div className="flex flex-col gap-3 justify-center items-center">
                {!emailStatus ? (
                    <>
                        <h1 className="text-2xl font-bold">Enter your email</h1>
                        <label htmlFor="email"></label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="email"
                            className="h-10 w-60 border-2 border-black rounded-md px-3"
                            />
                        <Button onClick={sendForgetEmail}>verify email</Button>
                    </>
                ) : (
                    <Button>Verification Email Sent</Button>
                )}
            </div>
        </div>
    )
}