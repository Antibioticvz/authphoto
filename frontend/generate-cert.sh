#!/bin/bash

# Script to generate self-signed SSL certificate for local development

CERT_DIR=".cert"
KEY_FILE="$CERT_DIR/key.pem"
CERT_FILE="$CERT_DIR/cert.pem"

echo "Generating self-signed SSL certificate..."

# Create directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Generate certificate
openssl req -x509 -newkey rsa:4096 -keyout "$KEY_FILE" -out "$CERT_FILE" \
  -days 365 -nodes -sha256 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:192.168.100.4"

if [ $? -eq 0 ]; then
  echo "✅ Certificate generated successfully!"
  echo "Key: $KEY_FILE"
  echo "Cert: $CERT_FILE"
  echo ""
  echo "Note: You'll need to accept the self-signed certificate in your browser."
  echo "On mobile devices, you may need to install the certificate."
else
  echo "❌ Failed to generate certificate"
  exit 1
fi
