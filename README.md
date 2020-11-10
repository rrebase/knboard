<h1 align="center">Simple Kanban boards</h1>

👉 [View Live](http://knboard.com/)

![image](https://user-images.githubusercontent.com/23059874/82831611-8f672600-9ec1-11ea-9d39-137936997925.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](https://github.com/rrebase/knboard/blob/master/CODE_OF_CONDUCT.md)

[![CircleCI](https://circleci.com/gh/rrebase/knboard.svg?style=svg)](https://circleci.com/gh/rrebase/knboard)
[![Maintainability](https://api.codeclimate.com/v1/badges/1dc1d840640dad52e38f/maintainability)](https://codeclimate.com/github/rrebase/knboard/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1dc1d840640dad52e38f/test_coverage)](https://codeclimate.com/github/rrebase/knboard/test_coverage)

## Quality 💪

- Auto formatted with Prettier and Black
- Tested with Jest, Pytest and Cypress
- Continuous Integration

## Built using a Modern stack 💎

### Frontend

- Typescript
- React with functional components and hooks
- Redux Toolkit
- Components & styling with Material-UI and Emotion
- Drag & Drop using react-beautiful-dnd
- Unit tests with React Testing Library
- Integration tests with Cypress

### Backend

- Django REST framework for a powerful API
- Django ORM for interacting with the database
- PostgreSQL
- Unit tests with Pytest

### Infra

- Blazing fast Nginx
- Dockerized production setup
- Continuous integration with CircleCI
- Server setup and deployment with Ansible

## Motivation 🎯

- Code samples for blog posts
- Implementing Auto DevOps
- Playing with tools that are free for open source
- Styling with Emotion

## Features ✨

- Multiple kanban boards
- Drag & drop tasks
- CRUD for tasks, labels & columns
- Edit task descriptions with Markdown
- Manage board members
- Update your profile & pick an avatar

## Development setup 🛠

Steps to locally setup development after cloning the project.

Note: `docker-compose` is currently only used for production.

### Django

Have Python 3.8 installed and in PATH.
Installing Python: https://realpython.com/installing-python/

```sh
python3 --version
# Python 3.8.2
```

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate

# Windows users
# virtualenv .venv
# .venv/scripts/activate

pip install -r requirements/local.txt

# Need to have Docker and Docker Compose installed
# Start PostgreSQL and other services via Docker Compose
docker-compose -f services.yml up --d

python manage.py migrate
python manage.py createsuperuser --username admin --email a@a.com
python manage.py loaddata avatars
python manage.py runserver
```

- API root available at `http://localhost:8000/api/`
- Admin available at `http://localhost:8000/backdoor/`

### React

- [Node.js](https://nodejs.org) v12 or greater
- [Yarn](https://yarnpkg.com/) v1 or greater

```sh
node --version
# v12.16
yarn --version
# 1.22.4
```

```sh
cd frontend
yarn install
yarn start
```

React app is now accessible at `http://localhost:3000`

### Quality tools

Check formatting & quality with eslint

```sh
yarn lint
```

Run Jest tests

```sh
yarn test
```

Run Cypress tests

```sh
yarn cypress run
```

Debug Cypress tests

```sh
npx cypress open
```

Run Python tests

```sh
python -m pytest
```

Check formatting with Black

```sh
black --exclude .venv .
```

## Articles

- [Full Guide to Testing Javascript & React](https://www.rrebase.com/posts/full-guide-to-testing-javascript-react)
- [Deploying knboard to DigitalOcean with Ansible](https://www.rrebase.com/posts/deploying-knboard-to-digitalocean-with-ansible)

## License

Licensed under the MIT license.

---

👉 [View Live](http://knboard.com/)
