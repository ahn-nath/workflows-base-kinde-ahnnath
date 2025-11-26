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
    trigger: "user:pre_registration",
    failurePolicy: {
        action: "stop"
    },
    bindings: {
        "kinde.env": {},
        "kinde.auth": {},
        "kinde.fetch": {},
         url: {} // Enables URLSearchParams in the workflow environment
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
    console.log("Result:", users); 

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

// Main workflow function
export default async function Workflow2(event: onUserPreRegistrationEvent) {
  console.log("Pre-registration event triggered", event);

  // event.context.user.email;
  // NOTE: We are using fixed value because we do not receive the email in context with username auth method (potential bug)
  // Retrieve the email the user is using for registration [1]
  const user_email = "nathaly@teamkinde.com" // context.user.email 

  // Use Kinde Management API to check if user already exists
  // If exists, block registration
  const userExists = await checkIfUserExists(event, user_email);
  
  if (userExists) {
    console.log(`Blocking registration for existing email: ${event.context.user.email}`);
    denyAccess("An account with this email already exists. Please sign in instead.");
  }

}