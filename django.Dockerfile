# Latest Python version supported by Django
FROM python:3.8

# Make sure logs are received in a timely manner
ENV PYTHONBUFFERED 1

# Install system packages
RUN apt-get update && apt-get upgrade -y

# Set working directory
WORKDIR /app

# Install Python packages
COPY ./backend/requirements/base.txt /app/requirements/base.txt
COPY ./backend/requirements/production.txt /app/requirements/production.txt
RUN pip install --no-cache-dir -r /app/requirements/production.txt

# Copy the project files
COPY ./backend/ /app/

# Wait for database to be ready, run database migrations, collectstatic for nginx to serve and then start the app
CMD bash -c "./wait-for-it.sh postgres:5432 && ./manage.py migrate --settings=config.settings.production && ./manage.py collectstatic --no-input && gunicorn config.wsgi:application --bind :8000"

# Make it accessible for the nginx container
EXPOSE 8000
