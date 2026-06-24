FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir requests
EXPOSE 8080
CMD ["python3", "start_server.py", "8080"]
