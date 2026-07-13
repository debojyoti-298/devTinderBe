// import { SendEmailCommand } from "@aws-sdk/client-ses";
// import { sesClient } from "./libs/sesClient.js";
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


// const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
//   return new SendEmailCommand({
//     Destination: {
//       /* required */
//       CcAddresses: [
//         /* more items */
//       ],
//       ToAddresses: [
//         toAddress,
//         /* more To-email addresses */
//       ],
//     },
//     Message: {
//       /* required */
//       Body: {
//         /* required */
//         Html: {
//           Charset: "UTF-8",
//           Data: `<h1>${body}</h1>`,
//         },
//         Text: {
//           Charset: "UTF-8",
//           Data: "This is the text format email",
//         },
//       },
//       Subject: {
//         Charset: "UTF-8",
//         Data: subject,
//       },
//     },
//     Source: fromAddress,
//     ReplyToAddresses: [
//       /* more items */
//     ],
//   });
// };


// //This is the actual code to run the email
// const run = async (toEmail, subject, body) => {
//   const sendEmailCommand = createSendEmailCommand(
//     // "recipient@example.com",
//     // "sender@example.com",
//     toEmail,
//     "debojyoti894@gmail.com", subject, body
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
//       /** @type { import('@aws-sdk/client-ses').MessageRejected} */
//       const messageRejectedError = caught;
//       return messageRejectedError;
//     }
//     throw caught;
//   }
// };

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [
        toAddress, // Make sure this isn't undefined or empty!
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

// Update this function to accept toEmail dynamically as the first argument
const run = async (toEmail, subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    toEmail,
    "debojyoti894@gmail.com", // This MUST be verified in your AWS SES console
    subject, 
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    throw caught;
  }
};
// const run = async (subject, body) => {
//   const sendEmailCommand = createSendEmailCommand(
//     // "recipient@example.com",
//     // "sender@example.com",
//     "tilakverma@gmail.com",
//     "debojyoti894@gmail.com", subject, body
//   );

//   try {
//     return await sesClient.send(sendEmailCommand);
//   } catch (caught) {
//     if (caught instanceof Error && caught.name === "MessageRejected") {
//       /** @type { import('@aws-sdk/client-ses').MessageRejected} */
//       const messageRejectedError = caught;
//       return messageRejectedError;
//     }
//     throw caught;
//   }
// };
module.exports = { run };

