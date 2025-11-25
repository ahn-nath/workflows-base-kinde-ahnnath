import { 
    // createKindeAPI, 
    WorkflowSettings, 
    WorkflowTrigger,
    onUserPreRegistrationEvent,
    denyAccess,
    getEnvironmentVariable,
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
    }
};

export default async function Workflow2({request, context}) {
  console.log("Pre-registration event triggered", request);

  const user_email = context.user.email; 
  console.log("Email received for this workflow was:", user_email)

  console.log("Request data:", JSON.stringify(request, null, 2));
  console.log("Context data:", JSON.stringify(context, null, 2));
}