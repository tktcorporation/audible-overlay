FROM mcr.microsoft.com/devcontainers/rust:1-bookworm AS dev-env

RUN apt-get update && \
    apt-get install -y \
    cmake \
    build-essential \
    libwebkit2gtk-4.1-dev \
    libopus-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    git

ENV LC_ALL=C.UTF-8

COPY Makefile Makefile
RUN make install
