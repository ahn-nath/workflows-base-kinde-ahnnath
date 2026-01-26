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

export default async function Workflow(event: onUserTokenGeneratedEvent){
  console.log("Token generation workflow triggered", event);
  
  const userID = event.context.user?.id;
  console.log("USER ID:", userID);
  

  const kindeAPI = await createKindeAPI(event);

  /* [1] Get Organization Details (with Billing expanded)
  // Endpoint: GET /api/v1/organization/{org_code}?expand=billing
  const { data: orgData } = await kindeAPI.get<OrganizationResponse>({
      endpoint: `organization?code=${orgCode}&expand=billing`
  });
  */
  const response = await kindeAPI.get({endpoint: `user?id=${userID}`});
  console.log(response);
  console.log("Success! API response:", JSON.stringify(response, null, 2));



  /*
  // 1. validates that the user email is received
  if (!userEmail) {
    console.log("No user email found, allowing registration");
    return;
  }
  
  console.log(`User attempting to register: ${userEmail}`);
  
  // 2. validates a specific email value if you sent it and allows you test the values and accessible
  // just not loggable
  const normalizedEmail = userEmail.trim().toLowerCase();
  if (normalizedEmail === "nathaly@teamkinde.com") {
    console.log("User email is nathaly@teamkinde.com");
  }
  // extract the user domain
  const atIndex = normalizedEmail.indexOf("@");

  if (atIndex !== -1) {
    // slice(atIndex) takes everything from the @ onwards
    const domain = normalizedEmail.slice(atIndex); 
    console.log(domain); // Output: "@teamkinde.com"
  } else {
    console.log("Invalid email");
  }
  // switch for common an knowm email domains
  */
}