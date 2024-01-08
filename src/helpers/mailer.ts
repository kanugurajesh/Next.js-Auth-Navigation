import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

// creating an interface to set the types of the email options
interface EmailOptions {
    email: string;
    emailType: string;
    userId: string;
}

// creating a function to send the email
export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
    try {
        // creating a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // checking the email type
        if (emailType === "VERIFY") {
            // updating the user with the verify token
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 });
        } else if (emailType === "RESET") {
            // updating the user with the forgot password token
            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 });
        }

        // sending the email
        const response = await fetch(`${process.env.DOMAIN}/api/send/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: email,
                subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
                firstName: "John",
                emailType: emailType,
                hashedToken: hashedToken,
            })
        });

        const data = await response.json();

        return data;

    } catch (error: any) {
        // if any error occurs throw the error
        throw new Error(error.message);
    }
};