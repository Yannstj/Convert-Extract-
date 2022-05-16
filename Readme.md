# Extract pdf

Extract PDF is part of the Worklist suite, along with the Worklist-API and the Worklist-dcm Server.

This project setup a small web server in Node taking pdf and posting key data to the API.

## Deploy

To deploy this project, git clone, use the Dockerfile to build your image and simply run it :

```
docker build . -t extract-pdf
docker run -d -p 3000:3000 --restart always --name worklist-client extract-pdf
```