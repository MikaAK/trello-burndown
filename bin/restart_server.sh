#!/usr/bin/env bash

if [ -n "$1" ]
then
  ssh -t $1 "cd ~/trello-burndown/server && mix ecto.migrate"
fi
