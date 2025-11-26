import { 
    WorkflowSettings, 
    onUserPreRegistrationEvent,
    denyAccess,
    getEnvironmentVariable,
    createKindeAPI,
} from "@kinde/infrastructure";

export const workflowSettings: WorkflowSettings = {
    id: "preRegistration",
    name: "LogUserEmail",
    trigger: "user:pre_registration", // TODO: the documentation of Kinde AI suggest the wrong way: WorkflowTrigger.UserPreRegistration,
    failurePolicy: {
        action: "stop"
    },
    bindings: {
        "kinde.env": {},
        "kinde.auth": {},
        "kinde.fetch": {},
    }
};

type HttpError = Error & {
  status?: number;
  response?: {
    status?: number;
    statusText?: string;
    data?: unknown;
  };
};

function safeStringify(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[unserializable value]";
  }
}

function formatErrorForLogging(error: unknown) {
  if (error instanceof Error) {
    const httpError = error as HttpError;
    return {
      name: httpError.name,
      message: httpError.message,
      status: httpError.status ?? httpError.response?.status,
      statusText: httpError.response?.statusText,
      responseData: safeStringify(httpError.response?.data),
      stack: httpError.stack,
    };
  }

  if (typeof error === "object" && error !== null) {
    return {
      message: "Non-Error object thrown",
      details: safeStringify(error),
    };
  }

  return {
    message: String(error),
  };
}


// Helper function to check if user exists
async function checkIfUserExists(
  event: onUserPreRegistrationEvent,
  email: string
): Promise<boolean> {
  try {
    console.log("Calling the Kinde Management API");
    // Initialize Kinde Management API
    const kindeAPI = await createKindeAPI(event);

    // Query users by email
    const { data: users } = await kindeAPI.get({
      endpoint: `users?email=${encodeURIComponent(email)}`,
    });
    console.log("ERROR:", users); 

    // Check if any users were found
    return users && users.users && users.users.length > 0;
  } catch (error) {
    const serializedError = formatErrorForLogging(error);
    console.error(
      "Error checking if user exists:",
      JSON.stringify(serializedError, null, 2)
    );
    // On error, allow registration to proceed (fail open)
    return false;
  }
}

// TODO 1: replace it with type event
// Main workflow function
export default async function Workflow2(event: onUserPreRegistrationEvent) {
  console.log("Pre-registration event triggered", event);

  // event.context.user.email;
  // NOTE: We are using fixed value because we do not receive the email in context with username auth method (potential bug)
  // Retrieve the email the user is using for registration [1]
  const user_email = "nathaly@teamkinde.com" // context.user.email

  // TODO 2: remove this
  console.log("Request data:", JSON.stringify(event.request, null, 2));
  console.log("Context data:", JSON.stringify(event.context, null, 2));

  // TODO 3: remove this
  /*
  if(user_email == "nathaly@teamkinde.com"){
    denyAccess("Existing email detected"); 
  }
  else{
    console.log("Allowing registration"); 
  }
  */ 

  // Use Kinde Management API to check if user already exists
  // If exists, block registration
  const userExists = await checkIfUserExists(event, user_email);
  
  if (userExists) {
    console.log(`Blocking registration for existing email: ${event.context.user.email}`);
    denyAccess("An account with this email already exists. Please sign in instead.");
  }

}