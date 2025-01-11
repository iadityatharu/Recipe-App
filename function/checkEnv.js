const requiredEnvVar = [
  "PORT",
  "ACCESSTOKEN",
  "ACCESSEXPIRE",
  "REFRESHTOKEN",
  "REFRESHEXPIRE",
  "MONGO_URL",
  "NODEMAILER_PASS",
  "NODEMAILER_USER",
  "STRIPE_SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
export const missingVar = () => {
  const missedVar = requiredEnvVar.filter((envVar) => !process.env[envVar]);
  if (missedVar.length > 0) {
    console.log("variable is missing in env file: ", missedVar);
    process.exit(1);
  }
};
