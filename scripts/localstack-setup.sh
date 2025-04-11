#!/bin/sh

set -e

echo "Initializing localstack s3"

awslocal s3 mb s3://example-bucket-name
