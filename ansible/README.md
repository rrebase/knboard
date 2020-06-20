## Ansible playbooks for server setup and deployment

Setup the server:
```sh
ansible-playbook -i hosts setup.yml -v
```

Deploy live branch:
```sh
ansible-playbook -i hosts deploy.yml
```
