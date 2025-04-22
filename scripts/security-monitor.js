#!/usr/bin/env node

/**
 * Security Monitor Script
 *
 * This script performs basic security checks on the codebase:
 * - Checks for leaked API keys or secrets
 * - Validates proper authentication implementation
 * - Checks for insecure dependencies
 * - Monitors for common security vulnerabilities
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes for better readability
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
};

console.log(
  `${colors.bold}${colors.cyan}======================================${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}      SECURITY MONITOR SCRIPT        ${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}======================================${colors.reset}`
);

// Patterns to check for potential security issues
const securityPatterns = {
  apiKeys:
    /(api[_-]?key|apikey|key|secret|password|token|auth)[=:"\s]+["']?([a-zA-Z0-9_\-]{20,})/gi,
  insecureRandoms: /Math\.random\(\)/g,
  directDbQueries: /db\.query\(.*\$\{.*\}/g,
  insecureEval: /eval\(|Function\(/g,
  insecureInnerHTML: /innerHTML\s*=/g,
  noAuthChecks: /supabase\.storage.*\.upload\((?!.*auth)/g,
  insecureHeadersPattern: /Access-Control-Allow-Origin:\s*\*/g,
  sensitiveDataLogging:
    /console\.log\(.*user|password|email|token|credit|auth/gi,
  directObjectReferences: /params\.id|req\.query\.id|req\.params\.id/g,
};

// Files to ignore
const ignoreFiles = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "package-lock.json",
  "yarn.lock",
  "security-monitor.js", // Ignore this script
];

// Track issues found
const issues = {
  critical: [],
  high: [],
  medium: [],
  low: [],
};

/**
 * Recursively scan files in a directory
 */
function scanFiles(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (ignoreFiles.some((ignore) => file.includes(ignore))) continue;

      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        scanFiles(filePath);
      } else {
        checkFile(filePath);
      }
    }
  } catch (error) {
    console.error(
      `${colors.red}Error scanning directory ${dir}:${colors.reset}`,
      error.message
    );
  }
}

/**
 * Check a file for security issues
 */
function checkFile(filePath) {
  try {
    // Ignore binary files and very large files
    const stats = fs.statSync(filePath);
    if (stats.size > 1024 * 1024) return; // Skip files larger than 1MB

    const ext = path.extname(filePath).toLowerCase();
    const allowedExts = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".html",
      ".css",
      ".json",
      ".env",
      ".example",
      ".md",
      ".yml",
      ".yaml",
      ".toml",
    ];

    if (!allowedExts.includes(ext) && !filePath.includes(".env")) return;

    const content = fs.readFileSync(filePath, "utf8");

    // Check for API keys and secrets
    const apiKeyMatches = [...content.matchAll(securityPatterns.apiKeys)];
    if (
      apiKeyMatches.length > 0 &&
      !filePath.includes(".example") &&
      !filePath.includes("security")
    ) {
      issues.critical.push({
        file: filePath,
        issue: "Potential API key or secret exposed",
        matches: apiKeyMatches.map((m) => m[0].substring(0, 40) + "..."),
        suggestion:
          "Move secrets to environment variables and use placeholder values in committed files",
      });
    }

    // Check for insecure random number generation
    if (
      securityPatterns.insecureRandoms.test(content) &&
      (filePath.includes("auth") ||
        filePath.includes("secur") ||
        filePath.includes("crypto"))
    ) {
      issues.high.push({
        file: filePath,
        issue: "Insecure random number generation with Math.random()",
        suggestion:
          "Use crypto.getRandomValues() or crypto.randomUUID() for security-critical operations",
      });
    }

    // Check for potential SQL injection
    if (securityPatterns.directDbQueries.test(content)) {
      issues.high.push({
        file: filePath,
        issue: "Potential SQL injection vulnerability",
        suggestion:
          "Use parameterized queries or ORM methods instead of string concatenation",
      });
    }

    // Check for eval usage
    if (securityPatterns.insecureEval.test(content)) {
      issues.high.push({
        file: filePath,
        issue: "Dangerous eval() or Function constructor usage",
        suggestion:
          "Avoid using eval() or Function constructor as they can execute arbitrary code",
      });
    }

    // Check for innerHTML usage
    if (securityPatterns.insecureInnerHTML.test(content)) {
      issues.medium.push({
        file: filePath,
        issue: "Potentially unsafe innerHTML assignment",
        suggestion:
          "Consider using textContent or DOM methods instead to prevent XSS attacks",
      });
    }

    // Check for file uploads without auth checks
    if (
      securityPatterns.noAuthChecks.test(content) &&
      (filePath.includes("upload") || filePath.includes("file"))
    ) {
      issues.high.push({
        file: filePath,
        issue: "File upload without authentication check",
        suggestion:
          "Add authentication validation before allowing file uploads",
      });
    }

    // Check for insecure CORS headers
    if (securityPatterns.insecureHeadersPattern.test(content)) {
      issues.medium.push({
        file: filePath,
        issue:
          "Overly permissive CORS headers (Access-Control-Allow-Origin: *)",
        suggestion:
          "Restrict CORS to specific origins instead of using wildcard",
      });
    }

    // Check for sensitive data logging
    if (securityPatterns.sensitiveDataLogging.test(content)) {
      issues.medium.push({
        file: filePath,
        issue: "Potentially sensitive data being logged",
        suggestion: "Avoid logging sensitive user information or credentials",
      });
    }

    // Check for insecure direct object references
    if (securityPatterns.directObjectReferences.test(content)) {
      issues.medium.push({
        file: filePath,
        issue: "Potential Insecure Direct Object Reference (IDOR)",
        suggestion: "Validate user authorization for the requested resource",
      });
    }
  } catch (error) {
    console.error(
      `${colors.red}Error checking file ${filePath}:${colors.reset}`,
      error.message
    );
  }
}

// Check for outdated dependencies with known vulnerabilities
function checkDependencies() {
  try {
    console.log(
      `\n${colors.blue}Checking for vulnerable dependencies...${colors.reset}`
    );

    // Check if npm-audit or npm is available
    try {
      const auditResult = execSync("npm audit --json", {
        stdio: ["pipe", "pipe", "ignore"],
      });
      const auditData = JSON.parse(auditResult.toString());

      if (auditData.vulnerabilities) {
        const vulnCount = Object.values(auditData.vulnerabilities).reduce(
          (sum, severity) => sum + severity,
          0
        );

        if (vulnCount > 0) {
          console.log(
            `${colors.yellow}Found ${vulnCount} vulnerabilities in dependencies${colors.reset}`
          );
          issues.medium.push({
            file: "package.json",
            issue: `Found ${vulnCount} vulnerabilities in dependencies`,
            suggestion: "Run npm audit fix or update affected packages",
          });
        } else {
          console.log(
            `${colors.green}No vulnerabilities found in dependencies${colors.reset}`
          );
        }
      }
    } catch (e) {
      console.log(
        `${colors.yellow}Could not run npm audit. Consider running it manually.${colors.reset}`
      );
    }
  } catch (error) {
    console.error(
      `${colors.red}Error checking dependencies:${colors.reset}`,
      error.message
    );
  }
}

// Check environment file for secure configuration
function checkEnvironmentFiles() {
  const envFiles = [
    ".env",
    ".env.development",
    ".env.production",
    ".env.local",
  ];

  envFiles.forEach((envFile) => {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, "utf8");

        if (
          content.includes("SUPABASE_ANON_KEY=") ||
          content.includes("API_KEY=")
        ) {
          if (
            !envFile.includes(".example") &&
            !fs.existsSync(`${envFile}.example`)
          ) {
            issues.high.push({
              file: envFile,
              issue: "Environment file with secrets but no example template",
              suggestion:
                "Create a .env.example file with placeholders to guide developers",
            });
          }
        }
      }
    } catch (error) {
      console.error(
        `${colors.red}Error checking env file ${envFile}:${colors.reset}`,
        error.message
      );
    }
  });
}

// Run security checks
console.log(
  `${colors.blue}Scanning files for security issues...${colors.reset}`
);
scanFiles(".");
checkDependencies();
checkEnvironmentFiles();

// Display results
console.log(
  `\n${colors.bold}${colors.cyan}======================================${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}          SECURITY REPORT             ${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}======================================${colors.reset}`
);

function displayIssues(category, issueList, color) {
  console.log(
    `\n${colors.bold}${color}${category} Issues (${issueList.length})${colors.reset}`
  );

  if (issueList.length === 0) {
    console.log(`${colors.green}No issues found.${colors.reset}`);
    return;
  }

  issueList.forEach((issue, index) => {
    console.log(`${colors.bold}${index + 1}. ${issue.file}${colors.reset}`);
    console.log(`   ${colors.red}Issue:${colors.reset} ${issue.issue}`);
    if (issue.matches) {
      console.log(
        `   ${colors.yellow}Matches:${colors.reset} ${issue.matches.join(", ")}`
      );
    }
    console.log(
      `   ${colors.green}Suggestion:${colors.reset} ${issue.suggestion}`
    );
    console.log();
  });
}

displayIssues("Critical", issues.critical, colors.red);
displayIssues("High", issues.high, colors.magenta);
displayIssues("Medium", issues.medium, colors.yellow);
displayIssues("Low", issues.low, colors.blue);

// Add an entry in package.json for running the security monitor
try {
  const packageJsonPath = path.join(".", "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    if (!packageJson.scripts?.["security:check"]) {
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts["security:check"] =
        "node scripts/security-monitor.js";

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(
        `\n${colors.green}Added 'npm run security:check' script to package.json${colors.reset}`
      );
    }
  }
} catch (error) {
  console.error(
    `${colors.red}Error updating package.json:${colors.reset}`,
    error.message
  );
}

const totalIssues =
  issues.critical.length +
  issues.high.length +
  issues.medium.length +
  issues.low.length;

console.log(
  `\n${colors.bold}${colors.cyan}======================================${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}          SUMMARY                    ${colors.reset}`
);
console.log(
  `${colors.bold}${colors.cyan}======================================${colors.reset}`
);
console.log(`${colors.bold}Total issues found: ${totalIssues}${colors.reset}`);
console.log(`${colors.red}Critical: ${issues.critical.length}${colors.reset}`);
console.log(`${colors.magenta}High: ${issues.high.length}${colors.reset}`);
console.log(`${colors.yellow}Medium: ${issues.medium.length}${colors.reset}`);
console.log(`${colors.blue}Low: ${issues.low.length}${colors.reset}`);

if (totalIssues === 0) {
  console.log(
    `\n${colors.green}${colors.bold}✓ No security issues found!${colors.reset}`
  );
} else {
  console.log(
    `\n${colors.yellow}${colors.bold}⚠ Please address the security issues listed above.${colors.reset}`
  );

  if (issues.critical.length > 0) {
    console.log(
      `${colors.red}${colors.bold}! Critical issues require immediate attention.${colors.reset}`
    );
  }
}
