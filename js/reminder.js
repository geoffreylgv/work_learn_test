const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function main() {
  try {
    // Fetch open issues/PRs
    const response = await octokit.rest.issues.listForRepo({
      owner: 'owner_name',
      repo: 'repository_name',
      state: 'open',
    });

    const now = new Date();

    for (const issue of response.data) {
      // Check if issue/PR hasn't been updated for 6 hours
      const lastUpdated = new Date(issue.updated_at);
      const timeSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60); // Hours

      if (timeSinceUpdate >= 6) {
        // Send a reminder comment
        await octokit.rest.issues.createComment({
          owner: 'owner_name',
          repo: 'repository_name',
          issue_number: issue.number,
          body: 'Hello! It has been 6 hours since the last update. Please review this issue/PR when you have a moment. Thank you!',
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
