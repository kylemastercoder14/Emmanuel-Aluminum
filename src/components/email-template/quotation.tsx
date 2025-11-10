import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components";

interface QuotationStatusEmailProps {
  firstName: string;
  lastName: string;
  serviceType: string;
  size: string;
  unit: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note?: string;
  estimatedPrice?: number;
}

export const QuotationStatusEmail = ({
  firstName,
  lastName,
  serviceType,
  size,
  unit,
  status,
  note,
  estimatedPrice,
}: QuotationStatusEmailProps) => {
  let title = "";
  let previewText = "";
  let headerEmoji = "";
  let statusColor = "#333";
  let extraMessage = "";

  switch (status) {
    case "PENDING":
      title = "We’ve received your quotation request!";
      previewText = "Your quotation request is pending review.";
      headerEmoji = "⏳";
      statusColor = "#f39c12"; // orange
      extraMessage =
        "Our team is currently reviewing your request. You will receive another email once it is approved or rejected.";
      break;

    case "APPROVED":
      title = "Your quotation has been approved!";
      previewText = "Great news! Your quotation was approved.";
      headerEmoji = "🎉";
      statusColor = "green";
      extraMessage =
        "Our staff will reach out to finalize the next steps. Thank you for choosing Emmanuel Aluminum Fabrication!";
      break;

    case "REJECTED":
      title = "Update on your quotation request";
      previewText = "Unfortunately, your quotation was not approved.";
      headerEmoji = "⚠️";
      statusColor = "red";
      extraMessage =
        "If you’d like, you can submit another quotation request with updated details. We’re here to help!";
      break;
  }

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{previewText}</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Heading style={h1}>
                {headerEmoji} {title}
              </Heading>

              <Text style={mainText}>
                Hello {firstName} {lastName},
              </Text>

              <Section style={detailSection}>
                <Text style={detailText}>
                  <strong>Service:</strong> {serviceType}
                </Text>
                <Text style={detailText}>
                  <strong>Size:</strong> {size} {unit}
                </Text>
                <Text style={detailText}>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: statusColor, fontWeight: "bold" }}>
                    {status}
                  </span>
                </Text>
                {typeof estimatedPrice !== "undefined" && status === "APPROVED" && (
                  <Text style={detailText}>
                    <strong>Estimated Price:</strong> ₱{estimatedPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                )}
                {note && (
                  <Text style={detailText}>
                    <strong>Note from staff:</strong> {note}
                  </Text>
                )}
              </Section>

              <Text style={mainText}>{extraMessage}</Text>
            </Section>

            <Hr />

            <Section style={lowerSection}>
              <Text style={cautionText}>
                Emmanuel Aluminum Fabrication will never ask for your password
                or banking details via email. Please be cautious of scams.
              </Text>
            </Section>
          </Section>

          <Text style={footerText}>
            This message was produced and distributed by Emmanuel Aluminum
            Fabrication. © 2025, Emmanuel Aluminum Fabrication, Inc.. All rights
            reserved. Emmanuel Aluminum Fabrication is a registered trademark of{" "}
            <Link
              href="https://emmanuel-aluminum.com"
              target="_blank"
              style={link}
            >
              emmanuel-aluminum.com
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export const QuotationStatusEmailHTML = (props: QuotationStatusEmailProps) =>
  render(<QuotationStatusEmail {...props} />, {
    pretty: true,
  });

/* ========= Styles ========= */
const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "16px 0",
};

const coverSection = { backgroundColor: "#fff" };
const upperSection = { padding: "25px 35px" };
const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const detailSection = {
  margin: "20px 0",
  padding: "15px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
};

const detailText = {
  ...text,
  margin: "4px 0",
};

const mainText = { ...text, marginBottom: "12px" };
const cautionText = { ...text, margin: "0px" };
