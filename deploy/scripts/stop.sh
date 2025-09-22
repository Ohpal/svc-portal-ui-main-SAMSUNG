#!/bin/bash

monitor=`/home/tapp/PKG/service/svc-portal-api/scripts/monitor.sh`;
if [ "$monitor" != "" ]; then
    kill $monitor
fi