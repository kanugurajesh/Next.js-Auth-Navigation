import { EmailTemplate } from '@/email/email-template';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { to, subject, firstName, emailType, hashedToken, } = reqBody;
        // @ts-ignore
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: to,
            subject: subject,
            react: EmailTemplate({ firstName: firstName, emailType: emailType, hashedToken: hashedToken }),
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}
