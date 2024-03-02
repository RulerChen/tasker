# Tasker

## Description

This is a simple task manager similar to Trello and built with microservices architecture.

## Microservices

- 0-shard-library : NPM package for shared code
- 1-gateway : API Gateway
- 2-notification : Send notifications (node-mailer)
- 3-auth : JWT Authentication for users
- 4-board : TODO
- 10-jenkins : Jenkins groovy scripts

keep adding more services...

## TODO LIST

- [x] Simple Microservices Architecture
- [x] Dockerize all services
- [x] Local Docker Compose
- [x] Local Elasticsearch
- [x] Local Minikube
- [x] Local Jenkins CI/CD
- [ ] GCP Deployment with Terraform
- [ ] Elasticsearch Cloud
- [ ] Jenkins CI/CD
- [ ] Garfana / Prometheus Monitoring
- [ ] Simeple UI
- [ ] Nginx
- [ ] Frontend Deployment
