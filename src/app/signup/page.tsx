// @ts-nocheck
"use client";

import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
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
    username: string;
    email: string;
    password: string;
}

export default function SignupPage(riveProps: UseRiveParameters = {}) {

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

    const router = useRouter();

    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: ""
    });

    const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {

        if (!isCheckingInput.value) {
            isCheckingInput.value = true;
        }

        const numChars = user.username.length;
        numLookInput.value = numChars * inputLookMultiplier;
    };

    const onUsernameFocus = () => {
        isCheckingInput.value = true;
        if (numLookInput.value !== user.username.length * inputLookMultiplier) {
            numLookInput.value = user.username.length * inputLookMultiplier;
        }
    }

    const onEmmailChange = (e: ChangeEvent<HTMLInputElement>) => {

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

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [showEye, setShowEye] = useState(false);

    const onSignup = async () => {

        try {
            // send the data to the server
            const response = await fetch("/api/users/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (data.success) {
                // give the success message using toast
                toast.success(data.message);
                trigSuccessInput.fire()
                // redirect to login page
                setTimeout(() => {
                    router.push("/login");
                }, 900);
            } else {
                // give the error message using toast
                toast.error(data.error);
                trigFailInput.fire()
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // useEffect to check if the user has filled all the details
    useEffect(() => {
        if (user.email && user.password && user.username) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user])


    return (
        <div className="flex flex-col justify-center h-screen items-center" style={{ backgroundColor: '#d6e2ea' }}>
            <div className="flex flex-col gap-3 justify-center items-center">
                <Toaster />
                <h1 className="text-2xl font-bold">Register your account</h1>
                <div>
                    <RiveComponent className="h-60 w-60" />
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) => {
                            setUser({ ...user, username: e.target.value });
                            onUsernameChange(e);
                        }}
                        onFocus={onUsernameFocus}
                        ref={inputRef}
                        onBlur={() => isCheckingInput.value = false}
                        placeholder="username"
                        className="h-10 w-60 border-2 border-black rounded-md px-3"
                    />
                </div>
                <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => {
                        setUser({ ...user, email: e.target.value })
                        onEmmailChange(e);
                    }}
                    onFocus={onEmailFocus}
                    ref={inputRef}
                    onBlur={() => isCheckingInput.value = false}
                    placeholder="email"
                    className="h-10 w-60 border-2 border-black rounded-md px-3"
                />
                <div className="relative">
                    <input
                        type={showEye ? "text" : "password"}
                        id="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="password"
                        className="h-10 w-60 border-2 border-black rounded-md px-3"
                        onFocus={() => isHandsUpInput.value = true}
                        onBlur={() => isHandsUpInput.value = false}
                    />
                    <Image src={showEye ? "/view.png" : "/hide.png"} alt="" width={23} height={23} className="absolute right-3 top-2" onClick={() => setShowEye(!showEye)} />
                </div>
                <Button onClick={onSignup}>{buttonDisabled ? "Fill details" : "Sign Up"}</Button>
                <a className="text-blue-500 border-b-2 border-transparent hover:border-b-2 hover:border-blue-500 py-1" href="/login">click here to login</a>
            </div>
        </div>
    )
}