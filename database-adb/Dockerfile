# https://github.com/arangodb/arangodb-docker/issues/22

# Specify the starting point image from docker-hub.  In this case its a docker image with node.js preinstalled on alpine linux.
FROM arangodb:latest

CMD arangod --server.endpoint tcp://0.0.0.0:$PORT \
  --database.directory standalone \
  --database.password $ARANGO_ROOT_PASSWORD