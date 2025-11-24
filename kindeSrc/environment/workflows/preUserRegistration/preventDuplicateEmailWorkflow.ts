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
        "kinde.auth": {}
    }
};

export default async function Workflow2(event: any) {
  console.log("Pre-registration event triggered", event);
}