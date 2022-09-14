#!/bin/bash

mongoimport products.json -d product -c products --jsonArray --drop
