#!/usr/bin/env bash
# Render kualitas penuh di komputer/server Linux dengan >=4 core (BUKAN Termux: Chrome tidak jalan di Termux).
set -e
cd "$(dirname "$0")/engine"
npm install
npx remotion browser ensure
mkdir -p out
npx remotion render PopeTrial out/PopeTrial-full.mp4 --gl=swangle --concurrency=$(nproc) --codec=h264 --crf=17
echo "Selesai: engine/out/PopeTrial-full.mp4"
