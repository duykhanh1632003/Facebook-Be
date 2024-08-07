const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

// Load environment variables from .env file
dotenv.config({
    path: path.join(__dirname, "../../.env")
});

// Define schema for environment variables with descriptions
const envVarSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development')
      .description('The environment in which the application is running, e.g., development, production, or test.'),
    
    PORT: Joi.number().default(8000)
      .description('The port on which the server will run. Default is 8000.'),
    
    URL_REACT: Joi.string().uri().default('http://localhost:5173/')
      .description('URL of the React frontend application.'),
    
    MAX_NUMBER_SCHEDULE: Joi.number().default(10)
      .description('Maximum number of schedules allowed.'),
    
    MONGOOSE_HTTP: Joi.string().uri().default('')
      .description('MongoDB connection string.'),
    
    GOOGLE_CLIENT_ID: Joi.string().default('')
      .description('Google OAuth Client ID.'),
    
    GOOGLE_CLIENT_SECRET: Joi.string().default('')
      .description('Google OAuth Client Secret.'),
    
    EMAIL_PASSWORD: Joi.string().default('')
      .description('Password for the email account.'),
    
    EMAIL_USERNAME: Joi.string().email().default('')
      .description('Email address for the account.'),
    
    AWS_ACCESS_KEY_ID: Joi.string().default('')
      .description('AWS Access Key ID.'),
    
    AWS_SECRET_ACCESS_KEY: Joi.string().default('')
      .description('AWS Secret Access Key.'),
    
    CLOUDINARY_SECRET: Joi.string().default('')
      .description('Cloudinary Secret Key.'),
    
    CLOUDINARY_APIKEY: Joi.string().default('')
      .description('Cloudinary API Key.'),
    
    CLOUDINARY_NAME: Joi.string().default('')
      .description('Cloudinary Cloud Name.'),
    
    URL_REDIS: Joi.string().uri().default('')
      .description('URL for the Redis instance.'),
    
    BUCKET: Joi.string().default('')
      .description('S3 Bucket name.'),
    
    REGION: Joi.string().default('')
      .description('AWS Region where the bucket is located.'),
    
    DISCORD_TOKEN: Joi.string().default('')
      .description('Discord bot token.'),
    
    CHANNEL_ID_DISCORD: Joi.string().default('')
      .description('Discord channel ID for bot operations.'),
    
    JWT_SECRET: Joi.string().default('thisisasamplesecret')
      .description('Secret key used to sign JWT tokens.'),
    
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30)
      .description('Number of minutes after which an access token expires.'),
    
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30)
      .description('Number of days after which a refresh token expires.'),
    
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10)
      .description('Number of minutes after which a reset password token expires.'),
    
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10)
      .description('Number of minutes after which a verify email token expires.'),
    
    SMTP_HOST: Joi.string().default('')
      .description('SMTP server host.'),
    
    SMTP_PORT: Joi.number().default(587)
      .description('SMTP server port. Default is 587.')
}).unknown()

const { value: envVars, error } = envVarSchema.prefs({
    errors: {label : 'key'}
}).validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    react: {
        url: envVars.URL_REACT,
    },
    maxNumberSchedule: envVars.MAX_NUMBER_SCHEDULE,
    mongoose: {
        url: envVars.MONGOOSE_HTTP + (envVars.NODE_ENV === 'test' ? '-test' : ''),
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    email: {
        smtp: {
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth: {
                user: envVars.SMTP_USERNAME,
                pass: envVars.SMTP_PASSWORD,
            },
        },
        from: envVars.EMAIL_FROM,
    },
    googleAuth: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        bucket: envVars.BUCKET,
        region: envVars.REGION,
    },
    cloudinary: {
        secret: envVars.CLOUDINARY_SECRET,
        apiKey: envVars.CLOUDINARY_APIKEY,
        cloudName: envVars.CLOUDINARY_NAME,
    },
    redis: {
        url: envVars.URL_REDIS,
    },
    discord: {
        token: envVars.DISCORD_TOKEN,
        channelId: envVars.CHANNEL_ID_DISCORD,
    },
};
