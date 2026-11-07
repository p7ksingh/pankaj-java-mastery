#!/bin/bash
# Deploy Lambda function to AWS
# Run: npm run deploy:lambda

set -e

FUNCTION_NAME="javabypankaj-api"
REGION="ap-southeast-2"

echo "── Deploying Lambda: $FUNCTION_NAME ──"

# Create zip from lambda directory
cd lambda
zip -r ../lambda-deploy.zip index.mjs
cd ..

# Update Lambda function code
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://lambda-deploy.zip \
  --region "$REGION"

# Cleanup
rm lambda-deploy.zip

echo "── Lambda deployed successfully ──"
