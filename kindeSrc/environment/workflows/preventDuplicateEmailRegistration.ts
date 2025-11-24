import {
  onUserPreRegistrationEvent,
  WorkflowSettings,
  WorkflowTrigger,
  denyAccess,
  createKindeAPI,
  getEnvironmentVariable,
} from "@kinde/infrastructure";

// Workflow settings
export const workflowSettings: WorkflowSettings = {
  id: "onTokenGeneration",
  name: "preventDuplicateEmailRegistration",
  trigger: WorkflowTrigger.UserPreRegistration,
  failurePolicy: {
    action: "stop",
  },
  bindings: {
    "kinde.auth": {},
    // "kinde.env": {},
    // "kinde.fetch": {},
  },
};

/*
// Helper function to check if user exists
async function checkIfUserExists(
  event: onUserPreRegistrationEvent,
  email: string
): Promise<boolean> {
  try {
    // TODO: check against relevant identity


    // Initialize Kinde Management API
    const kindeAPI = await createKindeAPI(event);

    // Query users by email
    const { data: users } = await kindeAPI.get({
      endpoint: `users?email=${encodeURIComponent(email)}`,
    });

    // Check if any users were found
    return users && users.users && users.users.length > 0;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    // On error, allow registration to proceed (fail open)
    return false;
  }
}
*/

// Main workflow function
export default async function preRegistrationWorkflow(
  event: onUserPreRegistrationEvent
) {
  console.log("Pre-registration workflow triggered", event);

  // Check if user email exists in the event
  if (!event.context.user?.email) {
    console.log("No user email found, allowing registration");
    return;
  }

  const email = event.context.user.email;
  console.log(`Checking if user exists with email: ${email}`);

  // Use Kinde Management API to check if user already exists
  let userExists = false
  // const userExists = await checkIfUserExists(event, email);

  if (userExists) {
    console.log(`Blocking registration for existing email: ${email}`);
    denyAccess("An account with this email already exists. Please sign in instead.");
  } else {
    console.log(`Email ${email} is available, allowing registration`);
  }
}