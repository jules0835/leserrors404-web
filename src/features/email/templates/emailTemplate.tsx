/* eslint-disable arrow-body-style */
import BotTemplate from "@/features/email/templates/botTemplate"
import TopTemplate from "@/features/email/templates/topTemplate"
import * as React from "react"
import { Html, Head, Body, Container, Section } from "@react-email/components"

interface EmailTemplateProps {
  locale: string;
  userName?: string;
  senderId: string;
  message: string;
  subject: string;
  children?: React.ReactNode;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  locale = "en",
  subject,
  userName,
  senderId,
  message,
  children,
}) => {
  return (
    <Html>
      <Head>
        <title>{subject}</title>
      </Head>
      <Body style={{ backgroundColor: "#2F1F80", padding: "16px" }}>
        <Container style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "1px solid #d1d5db", overflow: "hidden", margin: "0 auto", maxWidth: "32rem" }}>
          <TopTemplate locale={locale} userName={userName} />
          {message && (
            <Section style={{ padding: "16px 20px" }}>
              <p style={{ color: "#4b5563", fontSize: "1rem" }}>{message}</p>
            </Section>
          )}
          {children && (
            <Section style={{ padding: "16px 20px" }}>
              {children}
            </Section>
          )}
          <BotTemplate locale={locale} senderId={senderId} />
        </Container>
      </Body>
    </Html>
  )
}
