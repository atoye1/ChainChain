docker rm -f $(docker ps -aq)
docker rmi -f $(docker images dev-* -q)
yes | docker network prune
yes | docker volume prune
sudo rm -rf config
sudo rm -rf channel-artifacts
