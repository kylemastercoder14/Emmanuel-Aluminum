"use client";

import React from "react";


const tables = [
  {
    title: "User",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique identifier for each user."],
      ["name", "String", "Required", "Full name of the user."],
      ["email", "String", "Unique, Required", "User’s email address."],
      ["phoneNumber", "String", "Required", "User’s contact number."],
      ["password", "String", "Required", "Encrypted password of the user."],
      ["otpCode", "String?", "Optional", "One-time password for verification or recovery."],
      ["image", "String?", "Optional", "Profile image URL."],
      ["isEmailVerified", "Boolean", "Default: false", "Indicates if the email is verified."],
      ["createdAt", "DateTime", "Default: now()", "Record creation timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Record update timestamp."],
    ],
    relationships: [
      "1–* with Address",
      "1–* with Orders",
      "1–* with Notifications",
      "1–* with Message",
      "1–* with Conversation",
      "1–* with Report",
    ],
  },
  {
    title: "Address",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique identifier for each address."],
      ["fullName", "String", "Required", "Full name of the recipient."],
      ["phoneNumber", "String", "Required", "Contact number for delivery."],
      ["address", "String", "Required", "Complete delivery address."],
      ["createdAt", "DateTime", "Default: now()", "Record creation timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Record update timestamp."],
      ["userId", "String", "Foreign Key → User(id)", "Owner of this address."],
    ],
    relationships: ["*–1 with User"],
  },
  {
    title: "Staff",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique identifier for staff."],
      ["firstName", "String", "Required", "Staff’s first name."],
      ["lastName", "String", "Required", "Staff’s last name."],
      ["username", "String", "Unique, Required", "Staff’s login username."],
      ["password", "String", "Required", "Staff account password."],
      ["phoneNumber", "String", "Required", "Contact number."],
      ["image", "String?", "Optional", "Profile image."],
      ["role", "String", "Default: \"Staff\"", "Role or position."],
      ["isActive", "Boolean", "Default: true", "Account status."],
      ["createdAt", "DateTime", "Default: now()", "Record creation timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Record update timestamp."],
    ],
    relationships: ["1–* with Message", "1–* with Conversation"],
  },
  {
    title: "Service",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique identifier for service."],
      ["name", "String", "Required", "Service name."],
      ["description", "String?", "Optional", "Description of the service."],
      ["images", "String[]", "Required", "List of image URLs."],
      ["colors", "String[]", "Required", "Available color options."],
      ["price", "Float", "Required", "Base price of the service."],
      ["type", "String?", "Optional", "Type or classification."],
      ["category", "String", "Required", "Service category."],
      ["isAvailable", "Boolean", "Default: true", "Availability status."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
    ],
    relationships: ["1–* with OrderItems"],
  },
  {
    title: "Task",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique task identifier."],
      ["subject", "String", "Required", "Task title or subject."],
      ["status", "String", "Default: \"Pending\"", "Current task status."],
      ["priority", "String", "Default: \"Medium\"", "Task urgency level."],
      ["startDate", "String", "Required", "Start date (string format)."],
      ["endDate", "String", "Required", "End date (string format)."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
    ],
  },
  {
    title: "Orders",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique order identifier."],
      ["orderId", "String", "Unique, Required", "Public order reference code."],
      ["status", "String", "Default: \"Pending\"", "Order status."],
      ["totalAmount", "Float", "Required", "Total order amount."],
      ["paymentMethod", "String", "Required", "Payment method used."],
      ["scheduledDate", "String?", "Optional", "Scheduled service date."],
      ["scheduledTime", "String?", "Optional", "Scheduled service time."],
      ["createdAt", "DateTime", "Default: now()", "Order creation timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Order update timestamp."],
      ["dateCancelled", "DateTime?", "Optional", "Cancellation date if any."],
      ["userId", "String", "Foreign Key → User(id)", "Customer who placed the order."],
    ],
    relationships: ["*–1 with User", "1–* with OrderItems"],
  },
  {
    title: "OrderItems",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique identifier for order item."],
      ["quantity", "String", "Required", "Quantity of the service ordered."],
      ["color", "String", "Required", "Chosen color."],
      ["unitPrice", "String", "Required", "Price per unit."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
      ["orderId", "String", "Foreign Key → Orders(id)", "Related order."],
      ["serviceId", "String", "Foreign Key → Service(id)", "Related service."],
    ],
  },
  {
    title: "Notifications",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique notification ID."],
      ["title", "String", "Required", "Notification title."],
      ["message", "String", "Required", "Notification message body."],
      ["isRead", "Boolean", "Default: false", "Read status."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
      ["userId", "String", "Foreign Key → User(id)", "Recipient user."],
    ],
  },
  {
    title: "Message",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique message identifier."],
      ["content", "String", "Required", "Text content of the message."],
      ["imageUrl", "String?", "Optional", "Attached image (if any)."],
      ["isRead", "Boolean", "Default: false", "Message read status."],
      ["createdAt", "DateTime", "Default: now()", "Message creation timestamp."],
      ["userId", "String?", "Foreign Key → User(id)", "Sender/receiver (user)."],
      ["staffId", "String?", "Foreign Key → Staff(id)", "Sender/receiver (staff)."],
      ["conversationId", "String", "Foreign Key → Conversation(id)", "Related conversation."],
    ],
  },
  {
    title: "Conversation",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique conversation ID."],
      ["createdAt", "DateTime", "Default: now()", "Conversation creation date."],
      ["userId", "String", "Foreign Key → User(id)", "Associated user."],
      ["staffId", "String?", "Foreign Key → Staff(id)", "Assigned staff member (optional)."],
    ],
    relationships: ["1–* with Message", "1–* with Report"],
  },
  {
    title: "Report",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique report ID."],
      ["type", "String", "Required", "Report type/category."],
      ["description", "String?", "Optional", "Details of the report."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
      ["userId", "String", "Foreign Key → User(id)", "User who filed the report."],
      ["conversationId", "String?", "Foreign Key → Conversation(id)", "Related conversation (optional)."],
    ],
  },
  {
    title: "Quotation",
    rows: [
      ["id", "String ", "Primary Key, Required", "Unique quotation ID."],
      ["createdAt", "DateTime", "Default: now()", "Created timestamp."],
      ["updatedAt", "DateTime", "Auto-updated", "Updated timestamp."],
      ["firstName", "String", "Required", "Requester’s first name."],
      ["lastName", "String", "Required", "Requester’s last name."],
      ["contactNumber", "String", "Required", "Contact number."],
      ["email", "String", "Required", "Contact email."],
      ["serviceType", "String", "Required", "Type of service requested."],
      ["size", "String", "Required", "Size specification (e.g., 48x72)."],
      ["unit", "Enum(Unit)", "Required", "Measurement unit (INCH, CM, FT)."],
      ["color", "String?", "Optional", "Preferred color."],
      ["variants", "String?", "Optional", "Variant options (e.g., frosted, tinted)."],
      ["description", "String?", "Optional", "Additional request details."],
      ["preferredDate", "DateTime", "Required", "Preferred service date."],
      ["status", "String", "Default: \"PENDING\"", "Quotation request status."],
      ["note", "String?", "Optional", "Additional notes."],
    ],
    relationships: [],
  },
];

function TableCard({ table }: { table: any }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] bg-accent shadow-md border border-zinc-300">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">{table.title}</h3>
          {table.relationships && table.relationships.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{table.relationships.join(' · ')}</p>
          )}
        </div>

        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-4 py-3 text-left w-48">Field Name</th>
              <th className="px-4 py-3 text-left w-40">Data Type</th>
              <th className="px-4 py-3 text-left w-64">Constraints</th>
              <th className="px-4 py-3 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r: string[], idx: number) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50/80' : 'bg-blue-100/80'}>
                <td className="px-4 py-3 align-top font-medium">{r[0]}</td>
                <td className="px-4 py-3 align-top">{r[1]}</td>
                <td className="px-4 py-3 align-top">{r[2]}</td>
                <td className="px-4 py-3 align-top text-gray-600">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DataDictionaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-6">
        <div className="space-y-6">
          {tables.map((t) => (
            <TableCard key={t.title} table={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
