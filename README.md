
# Finansaurus Angular
This repository represents the interface part of the Finansaurus project. It displays the transactions, accounts, etc... and allows for easy entry of data.

# Installing with Docker
The following configuration can be used with docker compose:
```
version: '3.9'
services:
    ui:
    image: wouternivelle/finansaurus-angular:1.3.0
    restart: unless-stopped
    ports:
      - 8282:80
    environment:
      - API_URL=https://url-to-api/
```
