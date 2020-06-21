# Usage:
# $ chmod +x init-letsencrypt.sh
# $ init-letsencrypt.sh mydomain.com bob@email.com 1
#
# Reference:
# https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71
domain=${1}
rsa_key_size=4096
data_path="/home/chirpsdev/devchirps/certbot"
email=${2:-""}
staging=${3:-0}
if [ -d "$data_path" ]; then
  read -p "Existing data found for $domain. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi
echo "### Removing old certificate for $domain ..."
docker-compose -f docker-compose.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domain && \
  rm -Rf /etc/letsencrypt/archive/$domain && \
  rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
echo
echo "### Creating dummy certificate for $domain ..."
path="/etc/letsencrypt/live/$domain"
mkdir -p "$data_path/conf/live/$domain"
docker-compose -f docker-compose.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:1024 -days 1\
    -keyout "$path/privkey.pem" \
    -out "$path/fullchain.pem" \
    -subj '/CN=localhost'" certbot
echo
echo "### Starting containers ..."
docker-compose -f docker-compose.yml up --force-recreate -d
echo
echo "### Deleting dummy certificate for $domain ..."
docker-compose -f docker-compose.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domain && \
  rm -Rf /etc/letsencrypt/archive/$domain && \
  rm -Rf /etc/letsencrypt/renewal/$domain.conf" certbot
echo
echo "### Requesting Let's Encrypt certificate for $domain ..."
# Select appropriate email arg
case "$email" in
  "") email_arg="--register-unsafely-without-email" ;;
  *) email_arg="--email $email" ;;
esac
# Enable staging mode if needed
if [ $staging != "0" ]; then staging_arg="--staging"; fi
docker-compose -f docker-compose.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    -d $domain \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo
echo "### Reloading nginx ..."
docker-compose -f docker-compose.yml exec nginx nginx -s reload
echo
echo "### Stopping containers ..."
docker-compose -f docker-compose.yml stop
