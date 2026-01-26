import {
  onUserPreRegistration,
  WorkflowSettings,
  WorkflowTrigger,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
  id: "onUserPreRegistration",
  trigger: WorkflowTrigger.UserPreRegistration,
};

export default async function Workflow(event: onUserPreRegistration) {
  console.log("Pre-registration workflow triggered", event);
  
  const userEmail = event.context.user?.email;
  
  // 1. validates that the user email is received
  if (!userEmail) {
    console.log("No user email found, allowing registration");
    return;
  }
  
  console.log(`User attempting to register: ${userEmail}`);
  
  // 2. validates a specific email value if you sent it and allows you test the values and accessible
  // just not loggable
  if (userEmail == "nathaly@teamkinde.com"){
    console.log("User email is nathaly@teamkinde.com");
  }

  // extract the user domain
  // switch for common an knowm email domains
}