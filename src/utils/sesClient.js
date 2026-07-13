const { SESClient } = require("@aws-sdk/client-ses")
// import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
const REGION = "ap-south-1";
// Credentials are automatically resolved using the AWS SDK credential provider chain.
// For more information, see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html
// Create SES service object.

const sesClient = new SESClient({ region: REGION , 
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }});


// const credsFromEnv =
//   process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
//     ? {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       }
//     : process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY
//     ? {
//         accessKeyId: process.env.AWS_ACCESS_KEY,
//         secretAccessKey: process.env.AWS_SECRET_KEY,
//       }
//     : undefined;

// const sesClient = new SESClient({
//   region: REGION,
//   ...(credsFromEnv ? { credentials: credsFromEnv } : {}),
// });

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]

