import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeEmail(text: string): string {
  return `
  <div style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>${text}</p>
  </div>
  `;
}

export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to?: string[] | null;
  };
  messageId: string;
}
export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  try {
    // email user the token
    const info = await transport.sendMail({
      to,
      from: 'sickfits@example.com',
      subject: 'Your password reset token',
      html: makeEmail(
        `Your password reset token is here.
      
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
      `
      ),
    });

    if (process.env.MAIL_USER.includes('ethereal.email')) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`📧 Message Sent! Preview it at ${getTestMessageUrl(info)}`);
    } else {
      console.log('📧 Message Sent!');
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
