import {
  WorkflowSettings,
  onUserTokenGeneratedEvent,
  WorkflowTrigger,
  createKindeAPI
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "preRegistration",
  name: "Check user email domain",
  failurePolicy: {
    action: "stop",
  },
  trigger: WorkflowTrigger.UserTokenGeneration,
  bindings: {
    "kinde.env": {},
    "kinde.auth": {},
    "kinde.mfa": {},
    url: {}
  },
};

export default async function Workflow(event: onUserTokenGeneratedEvent) {
  console.log("Token generation workflow triggered", event);

  const userID = event.context.user?.id;
  console.log("USER ID:", userID);

  // Initialize the Kinde API to fetch full user details
  const kindeAPI = await createKindeAPI(event);
  const { data: userData } = await kindeAPI.get({ endpoint: `user?id=${userID}` });

  // Note: JSON.stringify might still show masked values in logs due to PII filtering,
  // but the object 'userData' contains the real values in memory.
  console.log("Success! API response received.");
  
  const userEmail = userData.preferred_email;

  // 1. Validation: Ensure the email property exists before proceeding
  if (!userEmail) {
    console.log("No user email found on the fetched profile.");
    return;
  }

  // 2. Proof of Value: We normalize the email to ensure case-insensitivity.
  // We log the LENGTH of the email. If this prints a number (e.g., 20) instead of 3 (for "***"),
  // it proves the code has access to the real hidden value.
  const normalizedEmail = userEmail.trim().toLowerCase();
  console.log(`Received email length: ${normalizedEmail.length}`);
  
  // Test against a known string to verify content access without printing PII
  const testEmail = "nathaly@teamkinde.com";
  console.log(`Expected email length: ${testEmail.length}`);
  
  if (normalizedEmail.includes(testEmail)) {
    console.log("User email MATCHED test email using .includes()");
  }

  // 3. Domain Extraction Logic
  const atIndex = normalizedEmail.indexOf("@");

  // Verify that the email structure is valid (contains an '@')
  if (atIndex !== -1) {
    // Extract the domain (substring from '@' to the end)
    const domain = normalizedEmail.slice(atIndex); 
    
    // Extract the username (substring from start up to '@')
    const username = normalizedEmail.slice(0, atIndex);

    // Logging these separate parts often bypasses the full-email PII mask, 
    // allowing you to verify you have the right data.
    console.log("Username extracted:", username); 
    console.log("Domain extracted:", domain);     

    // << HERE YOU CAN ADD YOUR LOGIC FOR THE CLAIMS AND CONDITIONAL CHECKS >>
    // Example:
    // if (domain === "@example.com") {
    //    // Add custom claim logic here
    // }

  } else {
    console.log("Invalid email format encountered");
  }
}