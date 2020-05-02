# Latest Python version supported by Django
FROM python:3.8

# Make sure logs are received in a timely manner
ENV PYTHONBUFFERED 1

# Install system packages
RUN apt-get update && apt-get upgrade -y

# Set working directory
WORKDIR /app

# Install Python packages
COPY ./backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the project files
COPY ./backend/ /app/

# Run database migrations, collectstatic for nginx to serve and then start the app
CMD bash -c "./manage.py migrate && ./manage.py collectstatic --no-input && gunicorn backend.wsgi:application --bind :8000"
