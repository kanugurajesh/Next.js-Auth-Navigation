import { EmailTemplate } from '@/email/contact-template';
import { Resend } from 'resend';
import { NextRequest } from 'next/server';
import { Subject, ReceiverEmail } from '@/lib/constants';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request:NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, email, message } = reqBody;
        // @ts-ignore
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ReceiverEmail,
            subject: Subject,
            react: EmailTemplate({ name: name, email: email, message: message }),
        });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error });
    }
}
