import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  emailType: 'VERIFY' | 'FORGET'; // Add the emailType property to EmailTemplateProps
  hashedToken: string; // Add the hashedToken property to EmailTemplateProps
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  emailType,
  hashedToken,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>
      Click{' '}
      <a
        href={`${process.env.DOMAIN}${
          emailType === 'VERIFY' ? '/verifyemail?token=' : '/verifyforgetemail?token='
        }${hashedToken}`}
      >
        here
      </a>{' '}
      to {emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste the link below in your browser.
      <br /> 
      {emailType === 'VERIFY' ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}` : `${process.env.DOMAIN}/verifyforgetemail?token=${hashedToken}`}
    </p>
  </div>
);
