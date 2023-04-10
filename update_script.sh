#!/bin/bash

# Kill the "api" screen session if it's running
if screen -list | grep -q "api"; then
  screen -S api -X quit
fi

# Create a new "api" screen session and run the "sudo sails lift" command
screen -dmS api bash -c "cd /home/administrator/BetterSNS-api/ && npm install -y && sudo sails lift"
