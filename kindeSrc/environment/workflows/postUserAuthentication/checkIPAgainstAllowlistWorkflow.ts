import {
  onPostAuthenticationEvent,
  WorkflowSettings,
  WorkflowTrigger,
  getEnvironmentVariable,
  denyAccess,
} from "@kinde/infrastructure";


// --- Configuration ---
// TODO: it should be included in the documentation to set this up
const allowList = [
  '64.227.0.197',
]


// --- Workflow Settings ---
export const workflowSettings: WorkflowSettings = {
  id: "onPostUserAuthentication",
  name: "checkIPAgainstAllowlist",
  failurePolicy: { action: 'stop' },
  trigger: WorkflowTrigger.PostAuthentication,
  bindings: {
  "kinde.auth": {},
  }
};


// --- Interfaces ---

// --- Helper functions ---

/**
 * Safely retrieves the allowlist of IPs.
 * @param allowList: array of strings - The allowlist to validate.
 * @returns void if valid, otherwise throws an error.
 */
function validateAllowList(allowList: string[]): void {

  if (!Array.isArray(allowList) || allowList.length === 0) {
    throw new Error("Allowlist must be a non-empty array.");

  }
  for (const ip of allowList) {
    if (typeof ip !== 'string' || !isValidIpAddress(ip)) {
      throw new Error(`Invalid IP address in allowlist: ${ip}`);
    }
  }
}

/**
 * Handles general errors by logging and denying access.
 * @param errorMessage The message to log and display to the user.
 * @param error The original error object (optional).
 */
function handleExceptionError(errorMessage: string, error?: any): void {
  console.error(`Check Againts IP Address Workflow Error: ${errorMessage}`, error); // TODO: to be modified
  denyAccess(`Access blocked due to an issue: ${errorMessage}`);
}

/**
 * Validates if a string is a valid IP address.
 * @param ip The IP address to validate.
 * @returns True if valid, false otherwise.
 */
function isValidIpAddress(ip: string): boolean {
  if (ip === 'unknown' || ip === 'localhost' || ip === '127.0.0.1') {
    return false;
  }

  // Basic IPv4 validation
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}


// --- Main Workflow Handler ---
export default async function handlePostAuth(event: onPostAuthenticationEvent) {
  console.log("Check IP Against Allowlist Workflow started");

  // TODO: We need to validate if this is expected
  // 1. Retrieve and validate allowlist
  validateAllowList(allowList);

  // 2. Get and validate IP address
  let ip = event.request.ip?.split(',')[0].trim() ?? 'unknown';
  // ip = '64.227.0.197'; // A known "allowed" IP for testing purposes
  console.log(`User IP address id the following: ${ip}`); // TODO: to be removed

  // Validate IP address
  if (!isValidIpAddress(ip)) {
    console.log("We hit an issue here");
    console.warn(`Invalid or private IP address detected: ${ip}. Access denied.`);
    denyAccess(`Access denied: Invalid or private IP address.`);
  }


  console.log("Allowlist and IP address validation passed.");
  
  // 3. Deny or allow access 
  if (!allowList.includes(ip)) {
    denyAccess(`Access denied: IP address ${ip} is not in the allowlist.`);
  }

  console.log('IP check completed successfully. Access granted.');

}
