### Building and running your application

When you're ready, start your application by running:
`docker-compose up --build`.

Your application will be available at http://localhost:8010.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References
* [Docker's Python guide](https://docs.docker.com/language/python/)

### Basic commands

- To stop the container you can use `docker-compose stop`
- To restart the container you can use `docker-compose restart`
- To start again the container (when stopped) you can use `docker-compose start`
- To verify the status of container you can use `docker-compose ps`

### Shutdown and Delete containeres, volumes, images.
* `docker-compose down`: To stop all and clean containers, networks created by docker compose, and *opcionally* volumes and images.
* `docker-compose down --volumes --rmi all`: You can add these flags to force delete volumes and images.

### Other util commands to control docker containers
`docker exec -it CONTAINER_ID bash` Execute bash on a container using the ID
`docker cp /path_to_file/file.backup CONTAINER_ID:/file.backup` Copy a file from local machine to container.