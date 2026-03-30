#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Push Code to GitHub - Royal Stay Hotels               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check git status
echo -e "${BLUE}[1/5] Checking git status...${NC}"
git status

echo ""
echo -e "${BLUE}[2/5] Adding all changes...${NC}"
git add -A
echo -e "${GREEN}✓ All changes staged${NC}"

echo ""
echo -e "${BLUE}[3/5] Committing changes...${NC}"
COMMIT_MESSAGE="feat: update Jenkinsfile for CI/CD pipeline and EC2 deployment"
git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓ Changes committed${NC}"

echo ""
echo -e "${BLUE}[4/5] Pushing to GitHub...${NC}"
git push origin main
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

echo ""
echo -e "${BLUE}[5/5] Verifying push...${NC}"
git log -1 --oneline
echo ""
echo -e "${GREEN}✓ Successfully pushed to GitHub! 🎉${NC}"
echo ""
echo "Next steps:"
echo "1. Go to GitHub: https://github.com/Lashandhananjaya/Devops"
echo "2. Verify the Jenkinsfile changes"
echo "3. Set up Jenkins with GitHub webhook"
echo "4. Jenkins will automatically build on next push"
