FROM node:latest
WORKDIR /home/node/

RUN git clone git-repo-with-id-pass && \
    cd Node-Skeleton && \
    npm install 


EXPOSE 8080
CMD cd /home/node/Node-Skeleton && npm start