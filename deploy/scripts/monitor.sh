#!/bin/bash

ps -aef | grep 'node /home/tapp/PKG/service/svc-portal-ui' | grep server.js | awk '{print $2}'