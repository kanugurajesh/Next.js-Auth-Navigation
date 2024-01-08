import * as React from 'react';
import { ReceiverName } from "@/lib/constants";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name,
    email,
    message,
}) => (
  <div>
    <h1>Hello, {ReceiverName}!</h1>
    <p>
      {name} has sent you a message from your website.
        <br />
        <br />
        <b>Name:</b> {name}
        <br />
        <b>Email:</b> {email}
        <br />
        <b>Message:</b> {message}
    </p>
  </div>
);
