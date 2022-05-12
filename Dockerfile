FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN mkdir /app

COPY requirements.txt /app/

WORKDIR /app

RUN pip install -r requirements.txt
