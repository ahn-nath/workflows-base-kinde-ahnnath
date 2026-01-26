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


  const kindeAPI = await createKindeAPI(event);

  const { data: userData } = await kindeAPI.get({ endpoint: `user?id=${userID}` });
  console.log(userData);
  console.log("Success! API response:", JSON.stringify(userData, null, 2));
  const userEmail = userData.preferred_email;


  // 1. validates that the user email is received
  if (!userEmail) {
    console.log("No user email found");
    return;
  }

  console.log(`User attempting to register: ${userEmail}`);

  // 2. validates a specific email value if you sent it and allows you test the values and accessible
  // just not loggable
  const normalizedEmail = userEmail.trim().toLowerCase();
  // TODO: replace email with work email
  console.log(`Received Email: '${normalizedEmail}'`);
  console.log(`Received Length: ${normalizedEmail.length}`);
  console.log(`Expected Length: ${"nathaly12toledo@gmail.com".length}`);
  if (normalizedEmail.includes("nathaly12toledo@gmail.com")) {
    console.log("User email MATCHED nathaly12toledo using .includes()");
  }

  // extract the user domain
  const atIndex = normalizedEmail.indexOf("@");

  if (atIndex !== -1) {
    // 1. Get the domain (from @ to the end)
    const domain = normalizedEmail.slice(atIndex); 
    
    // 2. Get the username (from start up to @)
    const username = normalizedEmail.slice(0, atIndex);

    console.log("Username:", username); // Output: nathaly12toledo
    console.log("Domain:", domain);     // Output: @gmail.com
} else {
    console.log("Invalid email");
}
  // switch for common an knowm email domains

}