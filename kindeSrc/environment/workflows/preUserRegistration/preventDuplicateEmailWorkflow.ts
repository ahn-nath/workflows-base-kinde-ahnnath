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

type UsersResponse = {
  users?: Array<{
    id?: string;
    email?: string;
  }>;
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/**
 * Determines whether the supplied email already belongs to an existing Kinde user.
 * @param event Workflow event providing auth context for the Management API.
 * @param email Email address to query in the tenant.
 * @returns `true` if at least one user record matches the email; otherwise `false`.
 */
async function checkIfUserExists(
  event: onUserPreRegistrationEvent,
  email: string
): Promise<boolean> {
  try {
    console.log("Calling the Kinde Management API");
    // Initialize Kinde Management API
    const kindeAPI = await createKindeAPI(event);

    // Query users by email
    const { data } = await kindeAPI.get<UsersResponse>({
      endpoint: `users?email=${encodeURIComponent(email)}`,
    });
    console.log("Kinde Management API response:", data);

    // Check if any users were found
    return Boolean(data?.users?.length);
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

/**
 * Pre-registration workflow entry point that blocks duplicate sign-ups by email.
 * @param event Kinde pre-registration event containing request/context metadata.
 */

export default async function Workflow2(event: onUserPreRegistrationEvent) {
  console.log("Pre-registration event triggered", event);

  const userEmail = 'nathaly@teamkinde.com'  // event.context?.user?.email;

  if (!userEmail) {
    console.error("Pre-registration event missing user email.");
    denyAccess("Unable to process registration: email is required.");
    return;
  }

  if (!isValidEmail(userEmail)) {
    console.error("Invalid email format received:", userEmail);
    denyAccess("Please provide a valid email address.");
    return;
  }

  // Use Kinde Management API to check if user already exists
  // If exists, block registration
  const userExists = await checkIfUserExists(event, userEmail);
  
  if (userExists) {
    console.log(`Blocking registration for existing email: ${event.context.user.email}`);
    denyAccess("An account with this email already exists. Please sign in instead: http://localhost:3000/");
  }

}