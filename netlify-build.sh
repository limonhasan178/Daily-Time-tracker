#!/usr/bin/env bash
set -euo pipefail

# ১. Flutter ক্লোন করা (stable channel)
git clone -b stable https://github.com/flutter/flutter.git --depth 1 "$HOME/flutter"

# ২. PATH এ Flutter যুক্ত করা
export PATH="$HOME/flutter/bin:$HOME/flutter/bin/cache/dart-sdk/bin:$PATH"

# ৩. Web এনাবল এবং প্রিক্যাশ করা
flutter config --enable-web
flutter precache --web

# ৪. অ্যাপটি বিল্ড করা
flutter build web --release
