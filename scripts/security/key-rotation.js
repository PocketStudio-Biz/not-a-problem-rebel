#!/usr/bin/env node

/**
 * Supabase API Key Rotation Script
 *
 * This script manages the secure rotation of Supabase API keys:
 * 1. Backs up existing environment files
 * 2. Rotates the anon key using Supabase Management API
 * 3. Updates all relevant environment files
 * 4. Notifies about required redeployments
 *
 * Usage:
 *   node scripts/security/key-rotation.js
 *
 * Note: Requires SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF to be set
 * as environment variables or in a .env.local file in the project root.
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local if it exists
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envLocal = dotenv.parse(fs.readFileSync(envLocalPath));
  Object.entries(envLocal).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

// Required environment variables
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF;

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

/**
 * Validate requirements before proceeding
 */
function validateRequirements() {
  const errors = [];

  if (!SUPABASE_ACCESS_TOKEN) {
    errors.push("Missing SUPABASE_ACCESS_TOKEN environment variable");
  }

  if (!SUPABASE_PROJECT_REF) {
    errors.push("Missing SUPABASE_PROJECT_REF environment variable");
  }

  if (errors.length > 0) {
    console.error(
      `${colors.red}${colors.bold}Configuration errors:${colors.reset}`
    );
    errors.forEach((error) => console.error(`- ${error}`));
    console.log(`\n${colors.yellow}To fix:${colors.reset}`);
    console.log(
      `1. Create a Supabase access token at https://supabase.com/dashboard/account/tokens`
    );
    console.log(
      `2. Find your project reference ID in the Supabase dashboard URL`
    );
    console.log(`3. Create a .env.local file in the project root with:`);
    console.log(`   SUPABASE_ACCESS_TOKEN=your_token`);
    console.log(`   SUPABASE_PROJECT_REF=your_project_ref\n`);
    process.exit(1);
  }
}

/**
 * Backup all environment files
 * @returns {string} Timestamp used for backup files
 */
function backupEnvironmentFiles() {
  console.log(`${colors.blue}Backing up environment files...${colors.reset}`);

  const timestamp = new Date().toISOString().replace(/:/g, "-");

  // List of environment files to back up
  const envFiles = [
    ".env",
    ".env.production",
    ".env.development",
    ".env.local",
  ];

  // Create backups
  let backupCount = 0;
  envFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      const backupFile = `${envFile}.backup-${timestamp}`;
      fs.copyFileSync(envFile, backupFile);
      backupCount++;
      console.log(
        `${colors.green}✓ Backed up ${envFile} to ${backupFile}${colors.reset}`
      );
    }
  });

  if (backupCount === 0) {
    console.log(
      `${colors.yellow}No environment files found to back up${colors.reset}`
    );
  }

  return timestamp;
}

/**
 * Rotate API keys using Supabase Management API
 * @returns {Promise<string>} The new anon key
 */
async function rotateApiKeys() {
  console.log(`${colors.blue}Rotating API keys...${colors.reset}`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.supabase.com",
      path: `/v1/projects/${SUPABASE_PROJECT_REF}/api-keys`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    };

    // First, get current keys to identify the anon key
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `API request failed with status code ${res.statusCode}: ${data}`
            )
          );
          return;
        }

        try {
          const apiKeys = JSON.parse(data);

          console.log(
            `${colors.yellow}Found ${apiKeys.length} API keys:${colors.reset}`
          );

          const anonKey = apiKeys.find(
            (key) => key.name === "anon key" || key.name === "anon"
          );

          if (!anonKey) {
            reject(new Error("Could not find anon key in the API response"));
            return;
          }

          console.log(
            `${colors.green}Found anon key with name: ${anonKey.name}${colors.reset}`
          );

          // Use direct API endpoint to rotate the key by name
          const rotateOptions = {
            hostname: "api.supabase.com",
            path: `/v1/projects/${SUPABASE_PROJECT_REF}/api-keys/rotate`,
            method: "POST",
            headers: {
              Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          };

          const rotateReq = https.request(rotateOptions, (rotateRes) => {
            let rotateData = "";

            rotateRes.on("data", (chunk) => {
              rotateData += chunk;
            });

            rotateRes.on("end", () => {
              if (rotateRes.statusCode !== 200) {
                reject(
                  new Error(
                    `API rotation request failed with status code ${rotateRes.statusCode}: ${rotateData}`
                  )
                );
                return;
              }

              try {
                const result = JSON.parse(rotateData);
                console.log(
                  `${colors.green}✓ Successfully rotated API keys${colors.reset}`
                );

                // Find the new anon key
                const newAnonKey = result.find(
                  (key) => key.name === "anon" || key.name === "anon key"
                );
                if (!newAnonKey) {
                  reject(
                    new Error(
                      "Could not find the new anon key in the rotation response"
                    )
                  );
                  return;
                }

                resolve(newAnonKey.api_key);
              } catch (error) {
                reject(
                  new Error(
                    `Failed to parse rotation response: ${error.message}`
                  )
                );
              }
            });
          });

          rotateReq.on("error", (error) => {
            reject(
              new Error(`Error during key rotation request: ${error.message}`)
            );
          });

          // No need to specify key name in body since we're using the /rotate endpoint
          rotateReq.write(JSON.stringify({}));
          rotateReq.end();
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Error during API request: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Update environment files with new API key
 * @param {string} newAnonKey - The new anon key
 */
function updateEnvironmentFiles(newAnonKey) {
  console.log(
    `${colors.blue}Updating environment files with new key...${colors.reset}`
  );

  const envFiles = [
    ".env",
    ".env.production",
    ".env.development",
    ".env.local",
  ];

  let updateCount = 0;

  envFiles.forEach((envFile) => {
    if (fs.existsSync(envFile)) {
      let content = fs.readFileSync(envFile, "utf8");

      // Replace the anon key
      const newContent = content.replace(
        /VITE_SUPABASE_ANON_KEY=.*/,
        `VITE_SUPABASE_ANON_KEY=${newAnonKey}`
      );

      if (content !== newContent) {
        fs.writeFileSync(envFile, newContent);
        updateCount++;
        console.log(
          `${colors.green}✓ Updated ${envFile} with new anon key${colors.reset}`
        );
      }
    }
  });

  if (updateCount === 0) {
    console.log(
      `${colors.yellow}No environment files were updated${colors.reset}`
    );
  }
}

/**
 * Main function to orchestrate the key rotation process
 */
async function rotateKeys() {
  console.log(
    `${colors.cyan}${colors.bold}==============================================${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bold}          SUPABASE KEY ROTATION TOOL          ${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bold}==============================================${colors.reset}\n`
  );

  try {
    // Validate requirements
    validateRequirements();

    // Backup environment files
    const timestamp = backupEnvironmentFiles();

    try {
      // Rotate API keys
      const newAnonKey = await rotateApiKeys();

      // Update environment files
      updateEnvironmentFiles(newAnonKey);

      // Notify about redeployment
      console.log(
        `\n${colors.green}${colors.bold}Key rotation completed successfully!${colors.reset}`
      );
      console.log(
        `\n${colors.yellow}${colors.bold}IMPORTANT: Next steps${colors.reset}`
      );
      console.log(`1. Commit the updated environment files`);
      console.log(
        `2. Redeploy your application: ${colors.cyan}npm run deploy${colors.reset}`
      );
      console.log(
        `3. Redeploy your Edge Functions: ${colors.cyan}npm run deploy:functions${colors.reset}`
      );
    } catch (error) {
      console.error(
        `\n${colors.red}${colors.bold}Error rotating keys: ${error.message}${colors.reset}`
      );

      // Restore backups
      console.log(`\n${colors.yellow}Restoring backups...${colors.reset}`);

      const envFiles = [
        ".env",
        ".env.production",
        ".env.development",
        ".env.local",
      ];

      envFiles.forEach((envFile) => {
        const backupFile = `${envFile}.backup-${timestamp}`;
        if (fs.existsSync(backupFile)) {
          fs.copyFileSync(backupFile, envFile);
          console.log(
            `${colors.green}✓ Restored ${envFile} from backup${colors.reset}`
          );
        }
      });

      process.exit(1);
    }
  } catch (error) {
    console.error(
      `\n${colors.red}${colors.bold}Unhandled error: ${error.message}${colors.reset}`
    );
    process.exit(1);
  }
}

// Run the key rotation
rotateKeys().catch((error) => {
  console.error(
    `\n${colors.red}${colors.bold}Fatal error: ${error.message}${colors.reset}`
  );
  process.exit(1);
});
