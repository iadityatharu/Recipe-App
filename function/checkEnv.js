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
];
export const missingVar = () => {
  const missedVar = requiredEnvVar.filter((envVar) => !process.env[envVar]);
  if (missedVar.length > 0) {
    console.log("variable is missing in env file");
    console.log(missedVar);
    process.exit(1);
  }
};
