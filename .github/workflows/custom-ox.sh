#!/bin/bash

# Add sleep before the ox action
sleep 15

start=`date +%s`

# Run the actual checkout action
sh -c "/usr/bin/docker run --name oxsecurityoxblockmodelatest_6ff9a5 --label f45b78 --workdir /github/workspace --rm \
  -e INPUT_OX_API_KEY=$OX_API_KEY \
  -e INPUT_OX_TIMEOUT=1 \
  -e INPUT_OX_FAIL_ON_TIMEOUT=TRUE \
  -e INPUT_OX_HOST_URL \
  -e INPUT_OX_SCAN_FULL_BRANCH=TRUE \
  -e INPUT_OX_OVERRIDE_BLOCKING \
  -e INPUT_OX_FAIL_ON_ERROR \
  -e INPUT_GITHUB_REPOSITORY_ID=579615061 \
  -e INPUT_GITHUB_REPOSITORY_URL \
  -e INPUT_GITHUB_PULL_REQUEST_HEAD_SHA \
  -e HOME \
  -e GITHUB_JOB \
  -e GITHUB_REF \
  -e GITHUB_SHA \
  -e GITHUB_REPOSITORY \
  -e GITHUB_REPOSITORY_OWNER \
  -e GITHUB_REPOSITORY_OWNER_ID \
  -e GITHUB_RUN_ID \
  -e GITHUB_RUN_NUMBER \
  -e GITHUB_RETENTION_DAYS \
  -e GITHUB_RUN_ATTEMPT \
  -e GITHUB_REPOSITORY_ID=579615061 \
  -e GITHUB_ACTOR_ID \
  -e GITHUB_ACTOR \
  -e GITHUB_TRIGGERING_ACTOR \
  -e GITHUB_WORKFLOW \
  -e GITHUB_HEAD_REF \
  -e GITHUB_BASE_REF \
  -e GITHUB_EVENT_NAME \
  -e GITHUB_SERVER_URL \
  -e GITHUB_API_URL \
  -e GITHUB_GRAPHQL_URL \
  -e GITHUB_REF_NAME \
  -e GITHUB_REF_PROTECTED \
  -e GITHUB_REF_TYPE \
  -e GITHUB_WORKFLOW_REF \
  -e GITHUB_WORKFLOW_SHA \
  -e GITHUB_WORKSPACE \
  -e GITHUB_ACTION \
  -e GITHUB_EVENT_PATH \
  -e GITHUB_ACTION_REPOSITORY \
  -e GITHUB_ACTION_REF \
  -e GITHUB_PATH \
  -e GITHUB_ENV \
  -e GITHUB_STEP_SUMMARY \
  -e GITHUB_STATE \
  -e GITHUB_OUTPUT \
  -e RUNNER_OS \
  -e RUNNER_ARCH \
  -e RUNNER_NAME \
  -e RUNNER_ENVIRONMENT \
  -e RUNNER_TOOL_CACHE \
  -e RUNNER_TEMP \
  -e RUNNER_WORKSPACE \
  -e ACTIONS_RUNTIME_URL \
  -e ACTIONS_RUNTIME_TOKEN \
  -e ACTIONS_CACHE_URL \
  -e ACTIONS_RESULTS_URL \
  -e GITHUB_ACTIONS=true \
  -e CI=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /home/runner/work/_temp/_github_home:/github/home \
  -v /home/runner/work/_temp/_github_workflow:/github/workflow \
  -v /home/runner/work/_temp/_runner_file_commands:/github/file_commands \
  -v /home/runner/work/crud-app/crud-app:/github/workspace \
  oxsecurity/ox-block-mode:latest"

finish=`date +%s`
elapsed=`expr $finish - $start`
echo "Scan ran for: $elapsed seconds"
