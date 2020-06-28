## Ansible playbooks for server setup and deployment

Setup the server:
```sh
ansible-playbook setup.yml --verbose
```

Initial request for SSL certs:
```sh
ssh knboard.com
sudo su -
cd /srv/knboard/
./init-letsencrypt.sh
```

Deploy:
```sh
ansible-playbook deploy.yml --verbose
```
