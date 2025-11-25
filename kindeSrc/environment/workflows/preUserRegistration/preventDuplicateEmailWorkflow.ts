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
    trigger: WorkflowTrigger.UserPreRegistration, // TODO: the documentation of Kinde AI suggest the wrong way: WorkflowTrigger.UserPreRegistration,
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

  // context.user.email;
  // NOTE: We are using fixed value because we do not receive the email in context with username auth method (potential bug)
  const user_email = "nathaly@teamkinde.com"  
  console.log("Email received for this workflow was:", user_email)

  console.log("Request data:", JSON.stringify(request, null, 2));
  console.log("Context data:", JSON.stringify(context, null, 2));

  if(user_email == "nathaly@teamkinde.com"){
    denyAccess("Existing email detected"); 
  }
  else{
    console.log("Allowing registration"); 
  }

}