import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
  secureFetch,
} from "@kinde/infrastructure";

// The setting for this workflow
export const workflowSettings: WorkflowSettings = {
  id: "postUserAuthentication",
  name: "Reset password modified",
  trigger: WorkflowTrigger.PostAuthentication,
  bindings: {
    "kinde.env": {}, // required to access your environment variables
    "kinde.secureFetch": {}, // Required for secure external API calls
  },
};

// This workflow requires you to set up your encryption key for the workflow
// This enabled `secureFetch` to encrypt the payload sent to your API
//
// In Settings -> Environment variables set up the following variables with the
// values from the M2M application you created above:
//
// * SECURE_API_URL - The URL of the API you want to send the payload to
//
// Ensure you have the encryption key available in your API to decrypt the payload

// The workflow code to be executed when the event is triggered
export default async function Workflow(event: onPostAuthenticationEvent) {
  try {
    const SECURE_API_URL = "https://webhook.site/809c84f3-1ae3-4fb4-b298-51d53c0c0be4";

    if (!SECURE_API_URL) {
      throw Error("Endpoint not set");
    }

    // The payload to send
    /*
    const payload = {
      type: "new_password_provided",
      user: event.context.user,
      newPasswordReason: event.context.auth.newPasswordReason,
    };
    */

    const payload = {
        userID: "randomID",
        email: "randomEmail",
        test: "standard_fetch_works"
    };

    console.log("payload:", payload);

    await secureFetch(SECURE_API_URL, {
      method: "POST",
      responseFormat: "json",
      headers: {
        "content-type": "application/json",
      },
      body: payload,
    });
  } catch(error){
    console.log("Standard Fetch Failed:");
    console.log("Error type:", error?.constructor?.name || typeof error);
    console.log("Error message:", error instanceof Error ? error.message : String(error));
    console.log("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    console.log("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.log("Error details:", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : String(error),
      ...(error && typeof error === 'object' ? error : {})
    });
  }
}