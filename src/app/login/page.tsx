// @ts-nocheck
"use client"

import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
    useRive,
    Layout,
    Fit,
    Alignment,
    UseRiveParameters,
    StateMachineInput,
    useStateMachineInput,
    RiveState,
} from "rive-react";

const STATE_MACHINE_NAME = 'Login Machine'


// creating a user interface
interface User {
    email: string,
    password: string
}

export default function LoginPage(riveProps: UseRiveParameters = {}) {

    // using the router hook
    const router = useRouter();

    // creating a user state
    const [user, setUser] = useState<User>({
        email: "",
        password: ""
    })

    const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef?.current && !inputLookMultiplier) {
            // @ts-ignore
            setInputLookMultiplier(inputRef.current.offsetWidth / 100);
        }
    }, [inputRef])

    // @ts-ignore
    const { rive: riveInstance, RiveComponent }: RiveState = useRive({
        src: '/bear.riv',
        stateMachines: STATE_MACHINE_NAME,
        autoplay: true,
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center
        }),
        ...riveProps
    });

    // State Machine Inputs
    const isCheckingInput: StateMachineInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isChecking');
    const numLookInput: StateMachineInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'numLook');
    const trigSuccessInput: StateMachineInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigSuccess');
    const trigFailInput: StateMachineInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'trigFail');
    const isHandsUpInput: StateMachineInput = useStateMachineInput(riveInstance, STATE_MACHINE_NAME, 'isHandsUp');

    const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {

        if (!isCheckingInput.value) {
            isCheckingInput.value = true;
        }

        const numChars = user.email.length;
        numLookInput.value = numChars * inputLookMultiplier;
    }

    const onEmailFocus = () => {
        isCheckingInput.value = true;
        if (numLookInput.value !== user.email.length * inputLookMultiplier) {
            numLookInput.value = user.email.length * inputLookMultiplier;
        }
    }

    // creating a button disabled state
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // creating a loading state
    const [loading, setLoading] = useState(false);

    // creating a show eye state
    const [showEye, setShowEye] = useState(false);

    // creating a on login function
    const onLogin = async () => {
        try {
            setLoading(true);
            // making a post request to the server
            const response = await fetch("/api/users/login/", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            // getting the data from the response
            const data = await response.json();
            // checking if the user is logged in or not
            if (data.success) {
                toast.success("Logged in successfully");
                trigSuccessInput.fire()
                setTimeout(() => {
                    router.push("/profile");
                }, 900);
            } else {
                toast.error(data.error);
            }
            setLoading(false);
        } catch (error: any) {
            trigFailInput.fire()
            toast.error(error.error)
        }
    }

    // using the use effect hook
    useEffect(() => {
        if (user.email && user.password) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user])

    return (
        <div className="flex flex-col justify-center h-screen items-center" style={{ backgroundColor: '#d6e2ea' }}>
            <div className="flex flex-col gap-3 justify-center items-center">
                <Toaster />
                <h1 className="text-2xl font-bold">Login</h1>
                <div>
                    <RiveComponent className="h-60 w-60" />
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => {
                            setUser({ ...user, email: e.target.value })
                            onEmailChange(e)
                        }}
                        onFocus={onEmailFocus}
                        ref={inputRef}
                        onBlur={() => isCheckingInput.value = false}
                        placeholder="email"
                        className="h-10 w-60 border-2 border-black rounded-md px-3"
                    />
                </div>
                <div className="relative">
                    <input
                        type={showEye ? "text" : "password"}
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        onFocus={() => isHandsUpInput.value = true}
                        onBlur={() => isHandsUpInput.value = false}
                        placeholder="password"
                        className="h-10 w-60 border-2 border-black rounded-md px-3"
                    />
                    <Image src={showEye ? "/view.png" : "/hide.png"} alt="" width={23} height={23} className="absolute right-3 top-2" onClick={() => setShowEye(!showEye)} />
                </div>
                <Button onClick={onLogin} disabled={buttonDisabled}>Login</Button>
                <div className="flex gap-5">
                    <a className="text-blue-500 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500 py-1 font-medium" href="/forgetpassword">forget password</a>
                    <a className="text-blue-500 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500 py-1 font-medium" href="/signup">register now</a>
                </div>
            </div>
        </div>
    )
}