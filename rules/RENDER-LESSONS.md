# Pelajaran render (cloud 1 core, 2026-11)
- Penyebab render lambat terbesar: `anisotropy = 8` pada tekstur lantai/dinding besar (SwiftShader). Sekarang 1 di mode LITE, 8/4 di mode penuh.
- Mode LITE (`--props='{"lite":true}'`): tekstur karakter 320x480, dpr 0.6, tanpa antialias. Default = kualitas penuh.
- Komposisi fps-aware: `PopeTrialLite` = 10 fps (630 frame) lalu ffmpeg naik ke 30 fps (blend). Semua timing pakai detik, bukan frame.
- Jangan jalankan beberapa render/still bersamaan di mesin 1 core (VM bisa restart). Jangan `pkill -f` dengan pola yang cocok dengan perintah sendiri.
- Still cepat untuk cek framing: batch kecil (<=8 frame) per proses.
- Hindari tilt besar pada Person (canvas terpotong); pakai FlatPuppet (rotasi mesh) untuk tubuh berbaring/diangkat.
