import { 
    createKindeAPI, 
    WorkflowSettings, 
    WorkflowTrigger,
} from "@kinde/infrastructure";


export const workflowSettings: WorkflowSettings = {
    id: "onTokenGeneration",
    name: "AddBillingDetailsToTokensB2C",
    trigger: WorkflowTrigger.UserTokenGeneration,
    failurePolicy: {
        action: "stop"
    },
    bindings: {
        "kinde.accessToken": {},
        "kinde.idToken": {},
        "kinde.env": {}, 
        url: {} // Enables URLSearchParams in the workflow environment
    }
};


// Types
interface WorkflowEvent {
    context: {
        user: {
            id: string;
        };
    };
    request?: unknown;
}


/**
 * 
 * @param event - The event object containing the context and bindings
 * @returns <void> - This function does not return a value, but the custom claims are set in the tokens 
 */
export default async function Workflow(event) {
    try{
        console.log("Pre-registration workflow triggered", event);

        // const kindeAPI = await createKindeAPI(event);

        
        // Check if user email exists in the event
        if (!event.context.user?.email) {
            console.log("No user email found, allowing registration");
            // return;
        }

        const userId = event.context?.user?.id;
        if(!userId){
            console.warn("No user id found in event.context.user.id — aborting workflow.");
            return;
        }


        console.log(`User id is ${userId}`);


}
 catch (err){
        console.error("Workflow error:", (err as Error).message ?? err);

        throw err;
 }
}