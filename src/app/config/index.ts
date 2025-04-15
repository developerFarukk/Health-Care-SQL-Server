
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN
    },
    reset_pass_link: process.env.RESET_PASS_LINK,
    bcript_solt_round: process.env.BCRIPT_SOLT_ROUND,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },
    ssl: {
        storeId: process.env.STORE_ID,
        storePass: process.env.STORE_PASS,
        successUrl: process.env.SUCCESS_URL,
        cancelUrl: process.env.CANCEL_URL,
        failUrl: process.env.FAIL_URL,
        sslPaymentApi: process.env.SSL_PAYMENT_API,
        sslValidationApi: process.env.SSL_VALIDATIOIN_API
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
}


// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(process.cwd(), '.env') });

// interface IConfig {
//     env: string;
//     port: string;
//     jwt: {
//         jwt_secret: string;
//         expires_in: string;
//         refresh_token_secret: string;
//         refresh_token_expires_in: string;
//         reset_pass_secret: string;
//         reset_pass_token_expires_in: string;
//     };
//     reset_pass_link: string;
//     bcript_solt_round: number;
//     emailSender: {
//         email: string;
//         app_pass: string;
//     };
//     ssl: {
//         storeId: string;
//         storePass: string;
//         successUrl: string;
//         cancelUrl: string;
//         failUrl: string;
//         sslPaymentApi: string;
//         sslValidationApi: string;
//     };
// }

// const getConfig = (): IConfig => {
//     const requiredEnvVars = [
//         'NODE_ENV',
//         'PORT',
//         'JWT_SECRET',
//         'EXPIRES_IN',
//         'REFRESH_TOKEN_SECRET',
//         'REFRESH_TOKEN_EXPIRES_IN',
//         'RESET_PASS_TOKEN',
//         'RESET_PASS_TOKEN_EXPIRES_IN',
//         'RESET_PASS_LINK',
//         'EMAIL',
//         'APP_PASS',
//         'STORE_ID',
//         'STORE_PASS',
//         'SUCCESS_URL',
//         'CANCEL_URL',
//         'FAIL_URL',
//         'SSL_PAYMENT_API',
//         'SSL_VALIDATIOIN_API'
//     ];

//     // Check for missing required variables
//     const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
//     if (missingVars.length > 0) {
//         throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
//     }

//     // Parse bcrypt salt rounds
//     const saltRound = process.env.BCRIPT_SOLT_ROUND;
//     const parsedSaltRound = saltRound ? parseInt(saltRound, 10) : 10;
//     if (isNaN(parsedSaltRound)) {
//         throw new Error(`Invalid BCRIPT_SOLT_ROUND value: ${saltRound}. Must be a number.`);
//     }

//     return {
//         env: process.env.NODE_ENV as string,
//         port: process.env.PORT as string,
//         jwt: {
//             jwt_secret: process.env.JWT_SECRET as string,
//             expires_in: process.env.EXPIRES_IN as string,
//             refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
//             refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
//             reset_pass_secret: process.env.RESET_PASS_TOKEN as string,
//             reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN as string
//         },
//         reset_pass_link: process.env.RESET_PASS_LINK as string,
//         bcript_solt_round: parsedSaltRound,
//         emailSender: {
//             email: process.env.EMAIL as string,
//             app_pass: process.env.APP_PASS as string
//         },
//         ssl: {
//             storeId: process.env.STORE_ID as string,
//             storePass: process.env.STORE_PASS as string,
//             successUrl: process.env.SUCCESS_URL as string,
//             cancelUrl: process.env.CANCEL_URL as string,
//             failUrl: process.env.FAIL_URL as string,
//             sslPaymentApi: process.env.SSL_PAYMENT_API as string,
//             sslValidationApi: process.env.SSL_VALIDATIOIN_API as string
//         }
//     };
// };

// const config: IConfig = getConfig();

// export default config;