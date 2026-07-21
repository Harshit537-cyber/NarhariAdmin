import { auth } from "./firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Recaptcha setup — invisible recaptcha, phone auth ke liye mandatory
export function setupRecaptcha(containerId = "recaptcha-container") {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
  }
  return window.recaptchaVerifier;
}

// OTP bhejna
export async function sendFirebaseOtp(mobile) {
  const phoneNumber = `+91${mobile}`; // country code add karo
  const appVerifier = setupRecaptcha();

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );

  // ye confirmationResult ko store karna hoga, verify step me use hoga
  window.confirmationResult = confirmationResult;
  return confirmationResult;
}

// OTP verify karna
export async function verifyFirebaseOtp(otp) {
  if (!window.confirmationResult) {
    throw new Error("OTP session expired, please resend OTP");
  }
  const result = await window.confirmationResult.confirm(otp);
  return result.user; // Firebase user object (idToken yahan se milega)
}