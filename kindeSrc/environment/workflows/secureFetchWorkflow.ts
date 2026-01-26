import {
  // onPostAuthenticationEvent,
  onNewPasswordProvidedEvent,
  WorkflowSettings,
  WorkflowTrigger,
  secureFetch
} from "@kinde/infrastructure";

// alredy did the binding
export const workflowSettings: WorkflowSettings = {
  id: "passReset",
  name: "Post Authentication - Create/Update User in database",
  trigger: WorkflowTrigger.NewPasswordProvided,
  bindings: {
    "kinde.env": {},
    "kinde.secureFetch": {},
  },
};

// https://webhook.site/9cc73bd5-80cb-4be4-8e5a-da9c8895f1f0

const TEST_URL = "https://webhook.site/809c84f3-1ae3-4fb4-b298-51d53c0c0be4"


// 1. The Client's Helper Function (Exact Copy)
function toURLSearchParams(obj: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params;
}

export default async function createCustomerUser(event: onNewPasswordProvidedEvent) {
  console.log(event);

  console.log("nathalytoledo@gmail.com")

  console.log("Standard Fecth test...");

  const payload = {
    userID: "randomID",
    email: "randomEmail",
    test: "standard_fetch_works"
  };

  try{

    const response = await secureFetch(TEST_URL, {
        method: "POST",
        responseFormat: "json",
        headers: {
          "content-type": "application/json"
        },
        body: payload,
      }
    );

    console.log("response raw is:", response)

    if(!response.ok){
      throw new Error(`HTTP Error!: ${response.status}`)
    }

    const data = await response.json()

    console.log("Success! API response:", JSON.stringify(data, null, 2));
     
  }
  catch(error){
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