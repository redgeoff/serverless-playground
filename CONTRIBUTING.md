# Set up

- The following should be done once to set up your fork and remote
- Visit https://github.com/redgeoff/serverless-playground, click the _Fork_ button in the top-right corner of the screen and fork the repo to your user space
- Set up the remote `git remote add MYUSERNAME git@github.com:MYUSERNAME/serverless-playground`
- Note: in the following steps, we assume your origin remote is set to `git@github.com:redgeoff/serverless-playground`

# Code Submission & Deployment

- The feature branch is created against the `master` branch for the fix/feature:
   ```
   $ git checkout master
   $ git pull
   $ git checkout -b feat-branch
   ```
- The work is done to the feature branch and changes are committed. A PR, that will merge work into master, is then created:
   ```
   $ git push MYUSERNAME feat-branch
   Create PR in GitHub UI.
   ```
- The PR is referenced in the Jira issue
- Developer requests a code review from Pod Lead. Developer then addresses any feedback. Lead then merges the PR into the `master` branch (via GitHub UI, preferably with a squash commit). The developer is responsible for following up with the Lead to make sure that the PR is merged into the `master` branch in the expected timeline. The `master` branch is used on staging and in production.
- Lead will automatically handle deployments on a daily basis