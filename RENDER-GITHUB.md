# Render kualitas penuh "Paus yang Mengadili Mayat" lewat GitHub (dari Termux)

Catatan penting: Remotion butuh Chrome. Chrome TIDAK bisa jalan di Termux, jadi Termux dipakai hanya untuk mengirim (push) file ke GitHub.
Render dikerjakan oleh server GitHub Actions (Ubuntu, 4 core). Perkiraan waktu: 1-2 jam. Hasil: file mp4 30fps 720x1280.

## Langkah (Termux)
1. Buat repo kosong baru di github.com (Private boleh), mis. `stick3d`.
2. Di Termux:
   ```
   pkg install -y git unzip
   termux-setup-storage
   unzip ~/storage/downloads/Stick3D-Pack-v4-PopeTrial.zip -d ~/
   cd ~/Stick3D-Pack
   git init -b main
   git add .
   git commit -m "pope trial"
   git remote add origin https://github.com/USERNAME/stick3d.git
   git push -u origin main
   ```
   (Saat diminta password, pakai Personal Access Token GitHub, bukan password akun.)
3. Buka repo di GitHub > tab **Actions** > **Render PopeTrial** > **Run workflow**.
4. Setelah hijau, buka run tersebut > bagian **Artifacts** > unduh `PopeTrial-full-mp4`.

## Render di komputer sendiri (opsional)
`bash render-full.sh` (Linux/Mac, 4 core ke atas).

## Isi penting
- `engine/src/videos/PopeTrial.tsx` : videonya (15 adegan)
- `engine/public/voice.wav`, `mix.wav`, `words.json` : suara + caption
- `02-videos/pope-trial/` : skrip, timing kata, efek suara
- Mode ringan (cepat, kualitas lebih rendah) hanya jika ditambah `--props='{"lite":true}'`. Default = kualitas PENUH.
