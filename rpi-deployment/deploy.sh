#!/bin/bash

# Creating the machines
for i in 1 2 3; do docker-machine create --driver digitalocean \
--digitalocean-image ubuntu-16-04-x64 \
--digitalocean-access-token $DIGITAL_OCEAN_ACCESS_TOKEN node-$i; done

# Firewall rules
docker-machine ssh node-1 ufw allow 22/tcp && \
ufw allow 2376/tcp && \ 
ufw allow 2377/tcp && \
ufw allow 7946/tcp && \
ufw allow 7946/udp && \
ufw allow 4789/udp && \
ufw enable -y && \
ufw reload && \
systemctl restart docker 

for i in 1 2 3; do
  docker-machine ssh node-$i ufw allow 22/tcp && \
    ufw allow 2376/tcp && \ 
    ufw allow 7946/tcp && \
    ufw allow 7946/udp && \
    ufw allow 4789/udp && \
    ufw enable -y && \
    ufw reload && \
    systemctl restart docker 
done

# Setting the manager
docker-machine ssh node-1 -- docker swarm init --advertise-addr $(docker-machine ip node-1) || echo "Already in swarm"

TOKEN=`docker-machine ssh node-1 docker swarm join-token worker | grep token | awk '{ print $5 }'`

for i in 2 3; do
  docker-machine ssh node-$i \
    -- docker swarm join --token ${TOKEN} $(docker-machine ip node-1):2377 || echo "Already a worker";
done

docker stack deploy --compose-file=docker-compose-swarm.yml rpi