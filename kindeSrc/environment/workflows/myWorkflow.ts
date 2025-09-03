import { createKindeAPI } from "@kinde/infrastructure";


export const workflowSettings = {
    id: "onTokenGeneration",
    trigger: "user:tokens_generation",
    bindings: {
        "kinde.accessToken": {},
        "kinde.idToken": {},
        "kinde.env": {}, 
        url: {} // Enables URLSearchParams in the workflow environment
    }
};

// {request, context}
export default async function Workflow(event) {
    // Logging for debugging purposes
    console.log("Token generation workflow with custom code executed");
    // Init 
    const kindeAPI = await createKindeAPI(event);

    // [1] Get the relevant details to contruct the user billing claim object
    // User object
    const userId = event.context.user.id;
    console.log("User ID:", userId);
    // TODo: [optimization] use params
    const { data: user } = await kindeAPI.get({
        endpoint: `users?id=${userId}&expand=billing`,
    });
    console.log("User object:", user);

    const customerId = user.customer_id;
    if (!customerId) {
        console.log("No customer ID found for user, skipping billing claim construction.");
        return;
    }
    // Entitlements
    const { data: entitlements } = await kindeAPI.get({
        endpoint: `billing/entitlements?customer_id=${customerId}`
    });
    console.log("Entitlements:", entitlements);
    // Agreements
    const { data: agreements } = await kindeAPI.get({
        endpoint: `billing/agreements?customer_id=${customerId}`
    });
    console.log("Agreements:", agreements);


    // [2] Construct the user billing claim object 
    let billingClaimObject = {};
    // customer ID key with value as a string
    billingClaimObject["customer_id"] = user.customer_id ? String(user.customer_id) : null;
    // Billing section from the user object object call
    billingClaimObject["user_billing"] = user.billing ? user.billing : {};
    // Entitlements array
    billingClaimObject['entitlements'] = entitlements ? entitlements : [];
    // Agreements array
    billingClaimObject['agreements'] = agreements ? agreements : [];
    console.log("Billing claim object:", billingClaimObject);


    kinde.accessToken.setCustomClaim("billingDetals", billingClaimObject);
    kinde.idToken.setCustomClaim("bILLingDeatils", billingClaimObject);
}