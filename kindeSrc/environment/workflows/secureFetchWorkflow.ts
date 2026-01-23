import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

// alredy did the binding
export const workflowSettings: WorkflowSettings = {
  id: "postUserAuthentication",
  name: "Post Authentication - Create/Update User in database",
  trigger: WorkflowTrigger.PostAuthentication,
  bindings: {
    // "kinde.secureFetch": {},
    "kinde.env": {},
    url: {},
  },
};

const TEST_URL = "https://webhook.site/9cc73bd5-80cb-4be4-8e5a-da9c8895f1f0"


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

export default async function createCustomerUser(event: onPostAuthenticationEvent) {
  console.log(event);

  console.log("Standard Fecth test...");

  const payload = {
    userID: "randomID",
    email: "randomEmail",
    test: "standard_fetch_works"
  };

  try{
     const response = await fetch(TEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: toURLSearchParams(payload),
    });

    if(!response.ok){
      throw new Error(`HTTP Error!: ${response.status}`)
    }

    const data = await response.json()

    console.log("Success! API response:", JSON.stringify(data, null, 2));
     
  }
  catch(error){
    console.log("Standard Fetch Failed:", error)

  }

}